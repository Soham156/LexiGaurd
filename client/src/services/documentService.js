// Document service for direct file uploads with Cloudinary storage
import { auth, db } from "../firebase/firebase.js";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Upload and analyze document with Cloudinary storage
export const uploadAndAnalyze = async (file, selectedRole = "user") => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  const startTime = Date.now();
  console.group("🚀 Document Upload Debug - FIXED VERSION 2.0");
  console.log(
    "🔧 This should use upload-and-analyze endpoint with text extraction"
  );
  console.log("📁 File details:", {
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString(),
  });
  console.log("👤 User details:", {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    role: selectedRole,
  });
  console.log(
    "🌐 API endpoint:",
    `${API_BASE_URL}/document/upload-and-analyze`
  );
  console.log("🔧 CACHE BUSTER - Using upload-and-analyze endpoint - v2.0");

  try {
    console.log("⏰ Step 1: Creating FormData...", new Date().toISOString());
    const formDataStart = Date.now();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userRole", selectedRole); // Backend expects userRole
    formData.append("jurisdiction", "India"); // Default jurisdiction
    formData.append("userId", auth.currentUser.uid);
    formData.append("userEmail", auth.currentUser.email);

    console.log(`✅ FormData created in ${Date.now() - formDataStart}ms`);

    console.log(
      "⏰ Step 2: Initiating fetch request...",
      new Date().toISOString()
    );
    const fetchStart = Date.now();

    // Upload file to backend with analysis and text extraction
    const response = await fetch(
      `${API_BASE_URL}/document/upload-and-analyze`,
      {
        method: "POST",
        body: formData,
        // Add timeout for debugging
        signal: AbortSignal.timeout(180000), // 3 minutes timeout
      }
    );

    const fetchEnd = Date.now();
    console.log(`✅ Fetch completed in ${fetchEnd - fetchStart}ms`);
    console.log("📊 Response details:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ HTTP Error:", {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        totalTime: `${Date.now() - startTime}ms`,
      });
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    console.log("⏰ Step 3: Parsing response...", new Date().toISOString());
    const parseStart = Date.now();

    const result = await response.json();

    const parseEnd = Date.now();
    console.log(`✅ Response parsed in ${parseEnd - parseStart}ms`);
    console.log("📋 Response data:", {
      success: result.success,
      hasFileUrl: !!result.data?.fileUrl,
      fileName: result.data?.fileName,
      publicId: result.data?.publicId,
    });

    console.log("Backend upload completed:", result);
    console.log("🔍 DETAILED RESULT INSPECTION:");
    console.log("result.success:", result.success);
    console.log("result.data:", result.data);
    console.log("result.data.analysis:", result.data?.analysis);
    console.log(
      "result.data.extractedText:",
      result.data?.extractedText
        ? `${result.data.extractedText.length} characters`
        : "null"
    );
    console.log(
      "result.data.fairnessBenchmark:",
      result.data?.fairnessBenchmark
    );

    if (result.success) {
      console.log(
        "⏰ Step 4: Storing in Firestore...",
        new Date().toISOString()
      );
      const firestoreStart = Date.now();

      // Store document metadata in Firestore (handle both old and new response formats)
      const docData = {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        fileName: file.name,
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type,
        selectedRole: selectedRole,
        uploadDate: serverTimestamp(),
        // Handle both response formats (upload-only-fix vs upload-and-analyze)
        analysisCompleted: !!(
          result.data?.analysis || result.data?.extractedText
        ),
        analysis: result.data?.analysis || null,
        fairnessBenchmark: result.data?.fairnessBenchmark || null,
        extractedText: result.data?.extractedText || null,
        status: result.data?.extractedText ? "processed" : "active",
        // Cloudinary file information
        cloudinaryUrl: result.data?.fileUrl || null,
        cloudinaryPublicId: result.data?.publicId || null,
        processingMethod:
          result.data?.metadata?.processingMethod || "upload-and-analyze",
        riskLevel: result.data?.analysis?.riskLevel || "pending",
      };

      console.log("🔍 FIRESTORE DATA TO SAVE:");
      console.log(
        "docData.extractedText:",
        docData.extractedText
          ? `${docData.extractedText.length} characters`
          : "null"
      );
      console.log("docData.analysis:", !!docData.analysis);
      console.log("docData.analysisCompleted:", docData.analysisCompleted);
      console.log("docData.status:", docData.status);
      const docRef = await addDoc(collection(db, "documents"), docData);

      const firestoreEnd = Date.now();
      console.log(
        `✅ Firestore save completed in ${firestoreEnd - firestoreStart}ms`
      );
      console.log("Document metadata stored in Firestore:", docRef.id);

      const totalTime = Date.now() - startTime;
      console.log(
        `🎉 TOTAL UPLOAD TIME: ${totalTime}ms (${(totalTime / 1000).toFixed(
          2
        )}s)`
      );
      console.groupEnd();

      return {
        success: true,
        documentId: docRef.id,
        fileName: file.name,
        analysis: result.data?.analysis,
        fairnessBenchmark: result.data?.fairnessBenchmark,
        fileUrl: result.data?.fileUrl,
      };
    } else {
      console.error("❌ Backend returned failure:", result);
      throw new Error(result.error || "Analysis failed");
    }
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error("❌ Upload and analyze error:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      totalTime: `${totalTime}ms`,
      timestamp: new Date().toISOString(),
    });
    console.groupEnd();
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Get all user documents
export const getAll = async () => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    // Simple query - only filter by userId
    const q = query(
      collection(db, "documents"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate?.(),
      }))
      // Filter and sort client-side
      .filter((doc) => doc.status !== "deleted")
      .sort((a, b) => {
        // Sort by uploadDate descending (newest first)
        const dateA = a.uploadDate || new Date(0);
        const dateB = b.uploadDate || new Date(0);
        return dateB - dateA;
      });

    return { success: true, documents };
  } catch (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }
};

// Get document by ID
export const getById = async (id) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    const docRef = doc(db, "documents", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Document not found");
    }

    const docData = docSnap.data();

    // Verify user owns this document
    if (docData.userId !== auth.currentUser.uid) {
      throw new Error("Access denied");
    }

    return {
      success: true,
      document: {
        id: docSnap.id,
        ...docData,
        uploadDate: docData.uploadDate?.toDate?.(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch document: ${error.message}`);
  }
};

// Re-analyze document
export const reAnalyze = async (documentId) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    // Get document from Firestore
    const docResult = await getById(documentId);
    const document = docResult.document;

    // Call backend for re-analysis using stored Cloudinary URL
    const response = await fetch(`${API_BASE_URL}/document/reanalyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId: documentId,
        cloudinaryUrl: document.cloudinaryUrl,
        fileName: document.fileName,
        selectedRole: document.selectedRole || "user",
        userId: auth.currentUser.uid,
      }),
    });

    if (!response.ok) {
      throw new Error(`Re-analysis failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      // Update document in Firestore
      const docRef = doc(db, "documents", documentId);
      await updateDoc(docRef, {
        analysis: result.analysis,
        analysisCompleted: true,
        lastAnalyzed: serverTimestamp(),
      });

      return {
        success: true,
        analysis: result.analysis,
      };
    } else {
      throw new Error(result.error || "Re-analysis failed");
    }
  } catch (error) {
    throw new Error(`Re-analysis failed: ${error.message}`);
  }
};

// Delete document
export const deleteDocument = async (id) => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    // Get document to verify ownership
    const docResult = await getById(id);
    const document = docResult.document;

    // Delete from Cloudinary via backend
    if (document.cloudinaryPublicId) {
      try {
        await fetch(`${API_BASE_URL}/document/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId: id,
            publicId: document.cloudinaryPublicId,
            userId: auth.currentUser.uid,
          }),
        });
      } catch (cloudinaryError) {
        console.warn("Could not delete from Cloudinary:", cloudinaryError);
        // Continue with Firestore deletion even if Cloudinary deletion fails
      }
    }

    // Mark as deleted in Firestore (soft delete)
    const docRef = doc(db, "documents", id);
    await updateDoc(docRef, {
      status: "deleted",
      deletedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

// Share document
export const share = async (documentId, userEmail, permissions = "read") => {
  if (!auth.currentUser) {
    throw new Error("Authentication required");
  }

  try {
    const shareData = {
      documentId: documentId,
      ownerUserId: auth.currentUser.uid,
      sharedWithEmail: userEmail,
      permissions: permissions,
      sharedAt: serverTimestamp(),
      status: "active",
    };

    await addDoc(collection(db, "document_shares"), shareData);

    return { success: true };
  } catch (error) {
    throw new Error(`Share failed: ${error.message}`);
  }
};

// Handle API errors and redirect if needed
export const handleApiError = (error, navigate) => {
  if (
    error.message.includes("auth") ||
    error.message.includes("Authentication required")
  ) {
    if (navigate) {
      navigate("/signin");
    }
  }
  return error.message;
};

export default {
  uploadAndAnalyze,
  getAll,
  getById,
  reAnalyze,
  deleteDocument,
  share,
  isAuthenticated,
  getCurrentUser,
  handleApiError,
};

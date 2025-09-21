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

  try {
    console.log("Starting file upload and analysis...");

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("selectedRole", selectedRole);
    formData.append("userId", auth.currentUser.uid);
    formData.append("userEmail", auth.currentUser.email);

    // Upload file to backend for processing
    const response = await fetch(
      `${API_BASE_URL}/document/upload-and-analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Backend analysis completed:", result);

    if (result.success) {
      // Store document metadata in Firestore
      const docData = {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        fileName: file.name,
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type,
        selectedRole: selectedRole,
        uploadDate: serverTimestamp(),
        analysisCompleted: !!result.analysis,
        analysis: result.analysis || null,
        status: "active",
        // Cloudinary file information
        cloudinaryUrl: result.fileUrl || null,
        cloudinaryPublicId: result.publicId || null,
        processingMethod: "cloudinary-direct",
        riskLevel: result.analysis?.riskLevel || "unknown",
      };

      const docRef = await addDoc(collection(db, "documents"), docData);

      console.log("Document metadata stored in Firestore:", docRef.id);

      return {
        success: true,
        documentId: docRef.id,
        fileName: file.name,
        analysis: result.analysis,
        fileUrl: result.fileUrl,
      };
    } else {
      throw new Error(result.error || "Analysis failed");
    }
  } catch (error) {
    console.error("Upload and analyze error:", error);
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

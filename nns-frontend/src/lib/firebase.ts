import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Firebase configuration (bạn đã có từ phần trên)
const firebaseConfig = {
  apiKey: "AIzaSyClWMBfKK-pABwkKFQWXyVgSEVcJHyJkmc",
  authDomain: "koi-farm-shop-fd1ef.firebaseapp.com",
  projectId: "koi-farm-shop-fd1ef",
  storageBucket: "koi-farm-shop-fd1ef.appspot.com",
  messagingSenderId: "669414724581",
  appId: "1:669414724581:web:a4beefc16c67334d09d50c",
  measurementId: "G-BEH6L3MXV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Hàm upload ảnh và trả về URL
export const uploadImage = async (file: File): Promise<string> => {
  try {
    //Random file name
    const randomName = Math.random().toString(36).substring(7);
    // Tạo một tham chiếu tới nơi lưu trữ trong Firebase Storage
    const storageRef = ref(storage, `images/${file.name}`+randomName);

    // Sử dụng uploadBytesResumable để upload file
    const uploadTask = await uploadBytesResumable(storageRef, file);

    // Sau khi upload hoàn thành, lấy URL của ảnh đã upload
    const downloadURL = await getDownloadURL(uploadTask.ref);

    return downloadURL; // Trả về URL của ảnh
  } catch (error:any) {
    throw new Error(`Upload failed: ${error?.message}`);
  }
};

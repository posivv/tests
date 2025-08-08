import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFileStore = defineStore(
  'fileStore',
  () => {
    const files = ref([]);

    const addFile = (file) => {
      files.value.unshift(file);
    };

    const removeFileByBlobName = (blobName) => {
      const index = files.value.findIndex((f) => f.blobName === blobName);
      if (index > -1) {
        files.value.splice(index, 1);
      }
    };

    const clearFiles = () => {
      files.value = [];
    };

    return { files, addFile, clearFiles, removeFileByBlobName };
  },
  {
    persist: true,
  }
);

<template>
  <main class="import-design-page">
    <section class="import-panel">
      <div class="import-header">
        <p class="eyebrow">Design Restore</p>
        <h1>Upload JSON</h1>
        <p class="description">Select the JSON file from an exported design package to continue editing it.</p>
      </div>

      <label
        class="upload-dropzone"
        :class="{ dragging: isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="application/json,.json"
          @change="handleFileChange"
        >
        <font-awesome-icon :icon="['fas', 'file-arrow-up']" class="upload-icon" />
        <span>{{ fileName || 'Choose or drop a .json file' }}</span>
      </label>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="actions">
        <button type="button" class="secondary-btn" @click="router.push({ name: 'ProductList' })">
          Back
        </button>
        <button type="button" class="primary-btn" :disabled="!selectedFile || isLoading" @click="importDesign">
          {{ isLoading ? 'Loading...' : 'Restore Design' }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { stashImportedDesign } from '../utils/importDesignTransfer';

const router = useRouter();
const fileInputRef = ref(null);
const selectedFile = ref(null);
const fileName = ref('');
const errorMessage = ref('');
const isDragging = ref(false);
const isLoading = ref(false);

const setSelectedFile = (file) => {
  errorMessage.value = '';
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
    errorMessage.value = 'Please upload a valid JSON file.';
    selectedFile.value = null;
    fileName.value = '';
    return;
  }
  selectedFile.value = file;
  fileName.value = file.name;
};

const handleFileChange = (event) => {
  setSelectedFile(event.target.files?.[0]);
};

const handleDrop = (event) => {
  isDragging.value = false;
  setSelectedFile(event.dataTransfer.files?.[0]);
};

const readFileAsText = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsText(file);
});

const validateDesignJson = (data) => {
  if (!data || typeof data !== 'object') return 'Invalid JSON content.';
  if (!data.id) return 'Missing product id in JSON.';
  if (!data.scene || !Array.isArray(data.scene.model)) return 'Missing scene model data in JSON.';
  const invalidModel = data.scene.model.find((item) => !item.type || !item.texture?.main);
  if (invalidModel) return 'Scene model texture data is incomplete.';
  return '';
};

const normalizeImportedLogoClips = (data) => {
  for (const model of data.scene.model) {
    const objects = model.texture?.main?.objects;
    if (!Array.isArray(objects)) continue;

    for (const object of objects) {
      if (!object?.id?.startsWith('image-')) continue;
      if (!object.clippedPanelId && object.clipPath?.id) {
        object.clippedPanelId = object.clipPath.id;
      }
    }
  }
};

const importDesign = async () => {
  if (!selectedFile.value) return;
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const text = await readFileAsText(selectedFile.value);
    const data = JSON.parse(text);
    const validationError = validateDesignJson(data);
    if (validationError) {
      errorMessage.value = validationError;
      return;
    }

    normalizeImportedLogoClips(data);
    stashImportedDesign(data.id, JSON.stringify(data));
    await router.push({
      name: 'Design',
      params: { productId: data.id },
      query: { import: '1' },
    });
  } catch (error) {
    console.error('Failed to import design JSON:', error);
    errorMessage.value = error instanceof SyntaxError
      ? 'Could not parse this JSON file.'
      : 'This design file is too large to import in the current browser session.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.import-design-page {
  align-items: center;
  background: #f8fafc;
  display: flex;
  min-height: calc(100vh - 4rem);
  padding: 2rem;
}

.import-panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  margin: 0 auto;
  max-width: 34rem;
  padding: 2rem;
  width: 100%;
}

.import-header {
  margin-bottom: 1.5rem;
}

.eyebrow {
  color: #4f46e5;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
}

h1 {
  color: #0f172a;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
}

.description {
  color: #64748b;
  line-height: 1.7;
  margin: 0.75rem 0 0;
}

.upload-dropzone {
  align-items: center;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-weight: 700;
  gap: 0.85rem;
  min-height: 12rem;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.upload-dropzone.dragging,
.upload-dropzone:hover {
  background: #eef2ff;
  border-color: #4f46e5;
  color: #3730a3;
}

.upload-dropzone input {
  display: none;
}

.upload-icon {
  font-size: 2rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 1rem 0 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.primary-btn,
.secondary-btn {
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 800;
  padding: 0.75rem 1rem;
}

.primary-btn {
  background: #4f46e5;
  color: #fff;
}

.primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.secondary-btn {
  background: #e2e8f0;
  color: #334155;
}

@media (max-width: 640px) {
  .import-design-page {
    padding: 1rem;
  }

  .import-panel {
    padding: 1.25rem;
  }

  .actions {
    flex-direction: column-reverse;
  }
}
</style>

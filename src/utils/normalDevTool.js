export function initNormalDevTool({
  hostElement,
  options,
  defaultOptions,
  onChange,
}) {
  if (!hostElement || !defaultOptions || typeof onChange !== 'function') return null;

  let objectUrl = null;
  const activeOptions = options || defaultOptions;

  const panel = document.createElement('div');
  panel.style.cssText = [
    'position:absolute',
    'right:12px',
    'bottom:12px',
    'z-index:20',
    'width:220px',
    'padding:10px',
    'border:1px solid rgba(15,23,42,.16)',
    'border-radius:8px',
    'background:rgba(255,255,255,.92)',
    'box-shadow:0 10px 28px rgba(15,23,42,.16)',
    'font:12px/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    'color:#0f172a',
    'backdrop-filter:blur(8px)',
  ].join(';');

  const title = document.createElement('div');
  title.textContent = 'Normal Dev Tool';
  title.style.cssText = 'font-weight:700;margin-bottom:8px';
  panel.appendChild(title);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.cssText = 'width:100%;font-size:11px;margin-bottom:8px';
  panel.appendChild(fileInput);

  const createRange = ({ label, value, min, max, step, digits = null }) => {
    const wrapper = document.createElement('label');
    wrapper.style.cssText = 'display:grid;gap:4px;margin-bottom:8px';
    wrapper.innerHTML = `<span>${label}: <b>${value}</b></span>`;

    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    wrapper.appendChild(input);
    panel.appendChild(wrapper);

    const update = () => {
      const nextValue = Number(input.value);
      wrapper.querySelector('b').textContent = digits === null
        ? String(nextValue)
        : nextValue.toFixed(digits);
    };

    return { input, update };
  };

  const density = createRange({
    label: '密度 repeat',
    value: activeOptions.repeat,
    min: 1,
    max: 120,
    step: 1,
  });
  const scale = createRange({
    label: '强度 scale',
    value: activeOptions.scale,
    min: 0,
    max: 10,
    step: 0.1,
    digits: 1,
  });
  const roughness = createRange({
    label: 'roughness',
    value: activeOptions.roughness,
    min: 0,
    max: 1,
    step: 0.01,
    digits: 2,
  });
  const metalness = createRange({
    label: 'metalness',
    value: activeOptions.metalness,
    min: 0,
    max: 1,
    step: 0.01,
    digits: 2,
  });

  const debugSelect = document.createElement('select');
  debugSelect.style.cssText = 'width:100%;height:28px;margin-bottom:8px';
  debugSelect.innerHTML = [
    '<option value="0">正常渲染</option>',
    '<option value="1">查看 normal 贴图</option>',
    '<option value="2">查看最终法线</option>',
  ].join('');
  debugSelect.value = String(activeOptions.debugNormalMode);
  panel.appendChild(debugSelect);

  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;gap:8px';

  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.textContent = '默认';
  resetButton.style.cssText = 'flex:1;height:28px;border:1px solid #cbd5e1;border-radius:6px;background:#fff';
  actions.appendChild(resetButton);

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.textContent = '关闭 Normal';
  clearButton.style.cssText = 'flex:1;height:28px;border:1px solid #cbd5e1;border-radius:6px;background:#fff';
  actions.appendChild(clearButton);

  panel.appendChild(actions);

  const revokeObjectUrl = () => {
    if (!objectUrl) return;
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  };

  const updateLabels = () => {
    density.update();
    scale.update();
    roughness.update();
    metalness.update();
  };

  const applyFromControls = (extra = {}) => {
    updateLabels();
    if (extra.url !== undefined && extra.url !== objectUrl) {
      revokeObjectUrl();
    }
    onChange({
      repeat: Number(density.input.value),
      scale: Number(scale.input.value),
      roughness: Number(roughness.input.value),
      metalness: Number(metalness.input.value),
      debugNormalMode: Number(debugSelect.value),
      ...extra,
    });
  };

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    revokeObjectUrl();
    objectUrl = URL.createObjectURL(file);
    applyFromControls({ url: objectUrl });
  });

  [density, scale, roughness, metalness].forEach(({ input }) => {
    input.addEventListener('input', () => applyFromControls());
  });
  debugSelect.addEventListener('change', () => applyFromControls());
  resetButton.addEventListener('click', () => {
    density.input.value = String(defaultOptions.repeat);
    scale.input.value = String(defaultOptions.scale);
    roughness.input.value = String(defaultOptions.roughness);
    metalness.input.value = String(defaultOptions.metalness);
    debugSelect.value = String(defaultOptions.debugNormalMode);
    applyFromControls({ url: defaultOptions.url });
  });
  clearButton.addEventListener('click', () => applyFromControls({ url: null }));

  const host = hostElement === document.body ? document.body : hostElement;
  const currentPosition = window.getComputedStyle(host).position;
  if (host !== document.body && currentPosition === 'static') {
    host.style.position = 'relative';
  }
  host.appendChild(panel);

  return {
    element: panel,
    dispose() {
      revokeObjectUrl();
      panel.remove();
    },
  };
}

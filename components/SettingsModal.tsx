import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchCustomModels } from '../services/aiService';
import { useSettings } from '../hooks/useSettings';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useSettings();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [models, setModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);
  const [modelSearchQuery, setModelSearchQuery] = useState('');

  useEffect(() => {
    setLocalSettings(settings);
    // When the modal opens, if custom API is enabled and we have credentials but no models, try fetching.
    if (isOpen && settings.useCustomApi && settings.apiUrl && settings.apiKey) {
      handleFetchModels(settings.apiUrl, settings.apiKey, settings.model);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, isOpen]);

  // Reset model list and status when API credentials change
  useEffect(() => {
    setModels([]);
    setFetchStatus(null);
    setError(null);
    setModelSearchQuery('');
  }, [localSettings.apiUrl, localSettings.apiKey]);

  const handleFetchModels = useCallback(async (apiUrl: string, apiKey: string, currentModel: string) => {
    if (!apiUrl || !apiKey) {
      setError('请先填写 API 地址和 Key。');
      return;
    }
    setIsLoadingModels(true);
    setError(null);
    setFetchStatus(null);
    setModels([]); 
    try {
      const fetchedModels = await fetchCustomModels(apiUrl, apiKey);
      if (fetchedModels.length > 0) {
        setModels(fetchedModels);
        setFetchStatus(`成功获取 ${fetchedModels.length} 个模型。请选择一个视觉模型。`);
        if (!currentModel || !fetchedModels.includes(currentModel)) {
          setLocalSettings(prev => ({ ...prev, model: fetchedModels[0] }));
        }
      } else {
        setError('未找到任何模型。请检查 API 或 Key 是否有权访问模型。');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取模型列表失败，请检查网络连接、地址和 Key 是否正确。';
      setError(errorMessage);
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  const handleSave = () => {
    setSettings(localSettings);
    onClose();
  };

  const handleClose = () => {
    setLocalSettings(settings);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setLocalSettings(prev => ({ ...prev, useCustomApi: checked }));
  };

  const filteredModels = useMemo(() => {
    const lowercasedQuery = modelSearchQuery.toLowerCase();
    if (!lowercasedQuery) {
      return models;
    }
    const results = models.filter(model =>
      model.toLowerCase().includes(lowercasedQuery)
    );
    return results;
  }, [models, modelSearchQuery]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 text-gray-800 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">高级设置</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" aria-label="关闭设置">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
            <label htmlFor="useCustomApi" className="font-semibold text-lg">使用自定义模型</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="useCustomApi"
                className="sr-only peer"
                checked={localSettings.useCustomApi}
                onChange={handleToggleChange}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {localSettings.useCustomApi && (
            <div className="space-y-4 p-4 border rounded-md animate-slide-down">
              <div>
                <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">API 地址 (需兼容 OpenAI)</label>
                <input
                  type="text"
                  name="apiUrl"
                  id="apiUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                  placeholder="https://api.example.com/v1"
                  value={localSettings.apiUrl}
                  onChange={handleInputChange}
                  aria-describedby="apiUrl-description"
                />
                <p id="apiUrl-description" className="mt-1 text-xs text-gray-500">
                  请输入 API 的基础 URL，例如 "https://api.example.com/v1"。请勿包含 "/chat/completions" 等路径。
                </p>
              </div>
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="password"
                  name="apiKey"
                  id="apiKey"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                  placeholder="sk-..."
                  value={localSettings.apiKey}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <button
                  onClick={() => handleFetchModels(localSettings.apiUrl, localSettings.apiKey, localSettings.model)}
                  disabled={isLoadingModels}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingModels ? '正在获取...' : '获取模型列表'}
                </button>
              </div>
              {fetchStatus && !error && <p className="text-sm text-green-600 mt-2">{fetchStatus}</p>}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">选择模型</label>
                {models.length > 0 && (
                  <div className="mb-2">
                    <input
                      type="search"
                      id="modelSearch"
                      placeholder="搜索模型..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                      value={modelSearchQuery}
                      onChange={(e) => setModelSearchQuery(e.target.value)}
                      aria-controls="model"
                    />
                  </div>
                )}
                <select
                  name="model"
                  id="model"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 bg-white text-black"
                  value={localSettings.model}
                  onChange={handleInputChange}
                  disabled={models.length === 0}
                >
                  {models.length === 0 ? (
                    <option value="">请先获取模型列表</option>
                  ) : filteredModels.length > 0 ? (
                    filteredModels.map(m => <option key={m} value={m}>{m}</option>)
                  ) : (
                    <option value="" disabled>无匹配模型</option>
                  )}
                </select>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={handleClose} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
              取消
            </button>
            <button onClick={handleSave} className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              保存
            </button>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
      `}} />
    </div>
  );
};

export default SettingsModal;
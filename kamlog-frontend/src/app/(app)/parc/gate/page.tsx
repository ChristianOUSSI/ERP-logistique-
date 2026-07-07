'use client';

import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { ScanText, UploadCloud, Truck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useComingSoon } from '@/contexts/ComingSoonContext';

export default function GateOperationsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const { showComingSoon } = useComingSoon();

  const handleSimulateOCR = () => {
    if (!file) return;
    setIsScanning(true);
    
    // Simulate OCR delay to look realistic
    setTimeout(() => {
      setScanResult({
        immatriculation: 'LT 123 AB',
        containerId: 'MSCU 1234567',
        driverName: 'KAMGA JEAN',
        confidence: 94
      });
      setIsScanning(false);
    }, 2500);
  };

  return (
    <ModuleLayout module="parc">
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ScanText className="w-8 h-8 text-blue-600" />
            Gate Operations & IA (OCR)
          </h1>
          <p className="text-sm text-slate-500 mt-2">Reconnaissance optique des documents d'entrée/sortie du parc.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Scanner un Document</h2>
            
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-6" onClick={() => document.getElementById('file-upload')?.click()}>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
              <p className="text-sm font-bold text-slate-700">Cliquez pour capturer ou uploader</p>
              <p className="text-xs text-slate-500 mt-1">BL, Interchange, ou Plaque Immatriculation</p>
              
              {file && (
                <div className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold">
                  Fichier sélectionné : {file.name}
                </div>
              )}
            </div>

            <button 
              onClick={handleSimulateOCR}
              disabled={!file || isScanning}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${file && !isScanning ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
            >
              {isScanning ? (
                <>
                  <ScanText className="w-5 h-5 animate-spin" /> Analyse IA en cours...
                </>
              ) : (
                <>Lancer la reconnaissance OCR</>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <ShieldAlert className="w-48 h-48" />
            </div>
            
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
              <ScanText className="w-5 h-5 text-blue-400" />
              Résultats de l'Extraction
            </h2>

            {isScanning ? (
              <div className="space-y-4 relative z-10">
                <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6"></div>
                <p className="text-blue-400 text-sm mt-8 animate-pulse font-mono">Loading Tesseract engine...</p>
              </div>
            ) : scanResult ? (
              <div className="space-y-6 relative z-10 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-3 text-emerald-400 mb-8">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-bold">Extraction réussie (Fiabilité {scanResult.confidence}%)</span>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Plaque détectée</p>
                  <p className="text-2xl font-mono text-white bg-slate-800 inline-block px-3 py-1 rounded-lg border border-slate-700">{scanResult.immatriculation}</p>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">N° Conteneur</p>
                  <p className="text-lg font-medium text-white">{scanResult.containerId}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Chauffeur (Nom sur document)</p>
                  <p className="text-lg font-medium text-white">{scanResult.driverName}</p>
                </div>

                <button 
                  onClick={() => showComingSoon('Création Auto Gate In')}
                  className="mt-8 w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white transition-colors"
                >
                  Valider le Gate In
                </button>
              </div>
            ) : (
              <div className="text-center text-slate-500 mt-12 relative z-10">
                <ScanText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun document scanné.</p>
                <p className="text-sm mt-2">Uploadez une image pour que le moteur OCR en extraie les données.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </ModuleLayout>
  );
}

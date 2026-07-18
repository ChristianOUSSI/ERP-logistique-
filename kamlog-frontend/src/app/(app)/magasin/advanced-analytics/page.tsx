// src/app/(app)/magasin/advanced-analytics/page.tsx - Advanced Analytics for K-Magasin
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { magasinAPI, analyticsAPI } from '@/lib/api-client'
import { toast } from 'sonner'

export default function AdvancedAnalyticsPage() {
  const router = useRouter()

  // State for demand forecasting
  const [forecastArticleId, setForecastArticleId] = useState<number | null>(null)
  const [forecastMagasinId, setForecastMagasinId] = useState<number | null>(null)
  const [forecastHorizon, setForecastHorizon] = useState<number>(30)
  const [forecastData, setForecastData] = useState<any>(null)
  const [forecastLoading, setForecastLoading] = useState<boolean>(false)

  // State for stock turnover analysis
  const [turnoverArticleId, setTurnoverArticleId] = useState<number | null>(null)
  const [turnoverMonths, setTurnoverMonths] = useState<number>(12)
  const [turnoverData, setTurnoverData] = useState<any>(null)
  const [turnoverLoading, setTurnoverLoading] = useState<boolean>(false)

  // State for safety stock calculation
  const [safetyArticleId, setSafetyArticleId] = useState<number | null>(null)
  const [safetyMagasinId, setSafetyMagasinId] = useState<number | null>(null)
  const [safetyServiceLevel, setSafetyServiceLevel] = useState<number>(0.95)
  const [safetyLeadTime, setSafetyLeadTime] = useState<number>(7)
  const [safetyData, setSafetyData] = useState<any>(null)
  const [safetyLoading, setSafetyLoading] = useState<boolean>(false)

  // State for anomaly detection
  const [anomalyArticleId, setAnomalyArticleId] = useState<number | null>(null)
  const [anomalyMagasinId, setAnomalyMagasinId] = useState<number | null>(null)
  const [anomalyDays, setAnomalyDays] = useState<number>(30)
  const [anomalySensitivity, setAnomalySensitivity] = useState<number>(2.0)
  const [anomalyData, setAnomalyData] = useState<any>(null)
  const [anomalyLoading, setAnomalyLoading] = useState<boolean>(false)

  // Common states
  const [articles, setArticles] = useState<any[]>([])
  const [magasins, setMagasins] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchReferenceData() {
      try {
        setIsLoading(true);
        const [articlesRes, magasinsRes] = await Promise.all([
          magasinAPI.getArticles(),
          magasinAPI.getMagasins()
        ]);
        setArticles(articlesRes.data);
        setMagasins(magasinsRes.data);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        toast.error('Erreur lors du chargement des données de référence');
      } finally {
        setIsLoading(false);
      }
    }
    fetchReferenceData();
  }, [])

  // Demand Forecasting Functions
  const handleGenerateForecast = async () => {
    if (!forecastArticleId) {
      toast.error('Veuillez sélectionner un article');
      return;
    }

    setForecastLoading(true);
    try {
      const res = await analyticsAPI.postDemandForecast({
        article_id: forecastArticleId,
        magasin_id: forecastMagasinId,
        horizon_days: forecastHorizon
      });
      setForecastData(res.data);
      toast.success('Prévision générée avec succès');
    } catch (error: any) {
      console.error('Error generating forecast:', error);
      toast.error(`Erreur lors de la génération de la prévision: ${error.response?.data?.detail || 'Erreur inconnue'}`);
    } finally {
      setForecastLoading(false);
    }
  }

  // Stock Turnover Analysis Functions
  const handleAnalyzeTurnover = async () => {
    if (!turnoverArticleId) {
      toast.error('Veuillez sélectionner un article');
      return;
    }

    setTurnoverLoading(true);
    try {
      const res = await analyticsAPI.postStockTurnoverAnalysis({
        article_id: turnoverArticleId,
        months: turnoverMonths
      });
      setTurnoverData(res.data);
      toast.success('Analyse de rotation terminée avec succès');
    } catch (error: any) {
      console.error('Error analyzing turnover:', error);
      toast.error(`Erreur lors de l'analyse de rotation: ${error.response?.data?.detail || 'Erreur inconnue'}`);
    } finally {
      setTurnoverLoading(false);
    }
  }

  // Safety Stock Calculation Functions
  const handleCalculateSafetyStock = async () => {
    if (!safetyArticleId || !safetyMagasinId) {
      toast.error('Veuillez sélectionner un article et un magasin');
      return;
    }

    setSafetyLoading(true);
    try {
      const res = await analyticsAPI.postSafetyStockCalculation({
        article_id: safetyArticleId,
        magasin_id: safetyMagasinId,
        service_level: safetyServiceLevel,
        lead_time_days: safetyLeadTime
      });
      setSafetyData(res.data);
      toast.success('Calcul du stock de sécurité terminé avec succès');
    } catch (error: any) {
      console.error('Error calculating safety stock:', error);
      toast.error(`Erreur lors du calcul du stock de sécurité: ${error.response?.data?.detail || 'Erreur inconnue'}`);
    } finally {
      setSafetyLoading(false);
    }
  }

  // Anomaly Detection Functions
  const handleDetectAnomalies = async () => {
    if (!anomalyArticleId || !anomalyMagasinId) {
      toast.error('Veuillez sélectionner un article et un magasin');
      return;
    }

    setAnomalyLoading(true);
    try {
      const res = await analyticsAPI.postAnomalyDetection({
        article_id: anomalyArticleId,
        magasin_id: anomalyMagasinId,
        days: anomalyDays,
        sensitivity: anomalySensitivity
      });
      setAnomalyData(res.data);
      toast.success('Détection d\'anomalies terminée avec succès');
    } catch (error: any) {
      console.error('Error detecting anomalies:', error);
      toast.error(`Erreur lors de la détection d'anomalies: ${error.response?.data?.detail || 'Erreur inconnue'}`);
    } finally {
      setAnomalyLoading(false);
    }
  }
  return <div><h1>Analytics</h1></div>;
}
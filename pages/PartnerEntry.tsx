
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';

export const PartnerEntry: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header / Nav Back */}
      <div className="p-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium">
            <Icons.ArrowLeft className="w-5 h-5" /> Retour
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Value Prop */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Icons.Handshake className="w-4 h-4" /> Programme Partenaire
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                Gagnez de l'argent en aidant<br/> les Algériens à acheter en ligne.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Devenez l'intermédiaire de confiance pour ceux qui n'ont pas de carte bancaire.
                Payez pour eux, récupérez le cash, et gardez <strong>100% de votre commission</strong>.
            </p>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icons.Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Soyez Visible</h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Les acheteurs vous trouvent dans notre annuaire par Wilaya et méthode de paiement (Main à main, CCP).
                </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icons.MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Négociez Directement</h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Le client vous contacte. Vous fixez votre commission librement. WeshKlik ne prend <strong>rien</strong> sur la transaction.
                </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icons.Repeat className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Fidélisez</h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Développez votre propre clientèle locale. Un client satisfait reviendra toujours vers vous.
                </p>
            </div>
        </div>

        {/* STEP 6 & 9: Explicit Rules & Legal */}
        <div className="mb-20">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Règles de Paiement & Livraison</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Icons.CheckCircle2 className="w-5 h-5" /> Modes Autorisés
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><Icons.Truck className="w-4 h-4 text-gray-400" /> Cash à la livraison (COD)</li>
                        <li className="flex items-center gap-2"><Icons.CreditCard className="w-4 h-4 text-gray-400" /> Mandat Cash / CCP</li>
                        <li className="flex items-center gap-2"><Icons.Handshake className="w-4 h-4 text-gray-400" /> Remise en main propre</li>
                    </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Icons.AlertCircle className="w-5 h-5" /> Rôle de WeshKlik
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Nous sommes uniquement une plateforme de mise en relation.</li>
                        <li>• Nous n'encaissons <strong>pas</strong> l'argent de vos clients.</li>
                        <li>• Vous êtes 100% responsable de la transaction financière.</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Pricing Model - The "Abonnement" */}
        <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Combien ça coûte ?</h2>
                <p className="text-gray-400 mb-8 text-lg">
                    Pas de pourcentage sur vos gains. Juste un petit loyer pour être affiché sur la plateforme.
                </p>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 inline-block w-full max-w-sm mb-6">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs mb-2 block">Abonnement Partner</span>
                    <div className="flex justify-center items-baseline gap-1 mb-4">
                        <span className="text-5xl font-extrabold">2000</span>
                        <span className="text-xl font-bold text-gray-400">DA / mois</span>
                    </div>
                    <ul className="text-left space-y-3 mb-8 text-gray-300 text-sm">
                        <li className="flex items-center gap-3">
                            <Icons.Check className="w-5 h-5 text-green-400" /> Profil certifié & Visible
                        </li>
                        <li className="flex items-center gap-3">
                            <Icons.Check className="w-5 h-5 text-green-400" /> Appels & WhatsApp illimités
                        </li>
                        <li className="flex items-center gap-3">
                            <Icons.Check className="w-5 h-5 text-green-400" /> 0% de commission WeshKlik
                        </li>
                    </ul>
                    <button 
                        onClick={() => navigate('/partner-onboarding')}
                        className="w-full bg-white text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Je postule
                    </button>
                </div>
                
                {/* STEP 9: MANDATORY LEGAL MENTION */}
                <p className="text-[10px] text-gray-500 max-w-md mx-auto leading-tight">
                    * L’abonnement WeshKlik correspond à un service de mise en relation et de visibilité dans l'annuaire. 
                    Il ne constitue pas une garantie financière sur les transactions effectuées.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};


import { useAuth } from '../context/AuthContext';

export const useSubscription = () => {
  const { user } = useAuth();

  const calculateStatus = () => {
    // Default / No Subscription state
    if (!user || user.type !== 'pro') {
      return {
        daysRemaining: 0,
        isExpired: false,
        isExpiringSoon: false,
        expiresAt: null,
        formattedDate: '-',
        packName: 'Gratuit',
        packSlug: 'free'
      };
    }

    // Handle Free Pack (Unlimited or specific logic)
    if (!user.package_expires_at || user.package_slug === 'free') {
       return {
        daysRemaining: Infinity,
        isExpired: false,
        isExpiringSoon: false,
        expiresAt: null,
        formattedDate: 'Illimité',
        packName: 'Starter (Gratuit)',
        packSlug: 'free'
      };
    }

    const now = new Date();
    const expiresAt = new Date(user.package_expires_at);
    
    // Calculate difference in days
    const diffTime = expiresAt.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isExpired = daysRemaining <= 0;
    const isExpiringSoon = !isExpired && daysRemaining <= 7;

    const packNames: Record<string, string> = {
      'free': 'Starter',
      'silver': 'Pro Silver',
      'gold': 'Import Expert'
    };

    return {
      daysRemaining,
      isExpired,
      isExpiringSoon,
      expiresAt,
      formattedDate: expiresAt.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' }),
      packName: packNames[user.package_slug || 'free'] || 'Standard',
      packSlug: user.package_slug
    };
  };

  return calculateStatus();
};

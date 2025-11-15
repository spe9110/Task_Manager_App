import User from "../models/user.model.js";
import logger from "../config/logging.js";
import cache from "../Utils/cache.js";

//@route   GET /api/v1/admin/users/dashboard
//@desc    Get user dashboard for admin with caching
//@access  PRIVATE (Admin only)
export const adminGetUserDashboard = async (req, res, next) => {
  try {
    // ✅ 1. Vérification du rôle admin d'abord (sécurité avant tout)
    if (req.user.role !== 'admin') {
      return next({ status: 403, message: 'Access denied: admin role required' });
    }

    const cacheKey = "all_users"; // clé unique pour le cache

    // ✅ 2. Vérifier si les données sont déjà dans le cache
    if (cache.has(cacheKey)) {
      logger.info("Users retrieved from cache", {
        requestedBy: req.user?.id || "anonymous",
      });

      const cachedData = cache.get(cacheKey);

      return res.status(200).json({
        message: "Users fetched successfully (from cache)",
        count: cachedData.count,
        data: cachedData.data,
      });
    }

    // ✅ 3. Si non en cache, récupérer depuis la base de données
    const users = await User.find({}).select("-password");

    if (!users || users.length === 0) {
      logger.warn("No users found in database", {
        requestedBy: req.user?.id || "anonymous",
      });
      return next({ status: 404, message: "No users found" });
    }

    // ✅ 4. Calculer le total des utilisateurs
    const usersTotal = await User.countDocuments();

    const result = {
      count: usersTotal,
      data: users,
    };

    // ✅ 5. Mettre en cache les résultats
    cache.set(cacheKey, result);

    logger.info("Users fetched from DB and cached successfully", {
      count: users.length,
      requestedBy: req.user?.id || "anonymous",
    });

    // ✅ 6. Envoyer la réponse finale
    res.status(200).json({
      message: "Users fetched successfully (from DB)",
      ...result,
    });
  } catch (error) {
    logger.error("Error fetching users", { error });
    next({ status: 500, error });
  }
};


/*

Explication de l’ordre logique :

Vérifier le rôle admin avant tout → sécurité d’abord, on évite de lire le cache ou la base inutilement.

Vérifier le cache → optimisation des performances.

Requête à la base de données → uniquement si non présent dans le cache.

Logger et gérer les cas “aucun utilisateur trouvé”.

Mettre en cache les nouvelles données.

Retourner la réponse au client.

*/ 
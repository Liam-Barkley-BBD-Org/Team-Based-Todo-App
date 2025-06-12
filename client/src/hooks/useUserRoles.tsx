import { useEffect, useState } from 'react';
import type { UserRole } from '../types/Role';

export const useUserRoles = (userId: string | number | null) => {
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchRoles = async () => {
            try {
                const res = await fetch(`https://api.acceleratedteamproductivity.shop/api/user_roles/user/${userId}`);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await res.json();
                setRoles(data || []);
            } catch (err) {
                setError("Failed to load roles");
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, [userId]);

    return { roles, loading, error };
};
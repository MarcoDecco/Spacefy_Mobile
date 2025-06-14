export interface LocalUser {
    id: string;
    email: string;
    token: string;
    lastLogin: string;
    isLoggedIn: number;
}

export interface LocalSpace {
    id: string;
    space_name: string;
    image_url: string;
    location: string;
    price_per_hour: number;
    space_description: string;
    space_amenities: string;
    space_type: string;
    max_people: number;
    week_days: string;
    opening_time: string;
    closing_time: string;
    space_rules: string;
    owner_name: string;
    owner_phone: string;
    owner_email: string;
    last_updated: string;
}

export interface LocalFavorite {
    id: number;
    space_id: string;
    user_id: string;
    created_at: string;
    last_viewed: string;
}

export interface DatabaseSchema {
    users: LocalUser;
    spaces: LocalSpace;
    favorite_spaces: LocalFavorite;
}

export interface DatabaseConfig {
    name: string;
    version: number;
    tables: {
        users: {
            name: string;
            columns: {
                id: string;
                email: string;
                token: string;
                lastLogin: string;
                isLoggedIn: string;
            };
        };
        spaces: {
            name: string;
            columns: {
                id: string;
                space_name: string;
                image_url: string;
                location: string;
                price_per_hour: string;
                space_description: string;
                space_amenities: string;
                space_type: string;
                max_people: string;
                week_days: string;
                opening_time: string;
                closing_time: string;
                space_rules: string;
                owner_name: string;
                owner_phone: string;
                owner_email: string;
                last_updated: string;
            };
        };
        favorite_spaces: {
            name: string;
            columns: {
                id: string;
                space_id: string;
                user_id: string;
                created_at: string;
                last_viewed: string;
                fk_space: string;
                fk_user: string;
                unique_favorite: string;
            };
        };
    };
} 
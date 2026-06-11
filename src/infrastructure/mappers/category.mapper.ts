import { Category } from "@/domain/entities/category/category";
import { CategoryProps } from "@/domain/entities/category/category.props";

export class CategoryMapper {

    static toDomain(props: CategoryProps): Category {

        return Category.restore(props);
    }

    static toPersistence(
        category: Category
    ): Record<string, unknown> {
        const persistence: Record<string, unknown> = {
            user_id: category.userId,
            name: category.name,
            icon: category.icon,
            color: category.color,
            type: category.type,
        };

        if (category.id) persistence.id = category.id;
        if (category.createdAt) persistence.created_at = category.createdAt;

        return persistence;
    }
}
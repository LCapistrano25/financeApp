import { Category } from "@/domain/entities/category/category";
import { CategoryProps } from "@/domain/entities/category/category.props";

export class CategoryMapper {

    static toDomain(props: CategoryProps): Category {

        return Category.restore(props);
    }

    static toPersistence(
        category: Category
    ): any {
        const persistence: any = {
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
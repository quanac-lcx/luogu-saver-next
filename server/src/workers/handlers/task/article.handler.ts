import type { SaveTask, TaskHandler } from '@/shared/task';
import { fetch } from '@/utils/fetch';
import { C3vkMode } from '@/shared/c3vk';
import type { Article as LuoguArticle, LentilleDataResponse, UserSummary } from '@/types/luogu-api';
import { createHash } from 'crypto';
import { ArticleService } from '@/services/article.service';
import { ArticleHistoryService } from '@/services/article-history.service';
import { UserService } from '@/services/user.service';
import { Article } from '@/entities/article';
import { User } from '@/entities/user';
import { ArticleCategory } from "@/shared/article";
import { logger } from '@/lib/logger';
import { UserColor } from "@/shared/user";

function sha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
}

function buildUser(user: UserSummary): Partial<User> {
    return {
        id: user.uid,
        name: user.name,
        color: user.color as UserColor
    };
}

export class ArticleHandler implements TaskHandler<SaveTask> {
    public taskType = 'save:article';

    public async handle(task: SaveTask): Promise<void> {
        const url = `https://www.luogu.com/article/${task.payload.targetId}`;
        const resp: LentilleDataResponse<{ article: LuoguArticle }> = await fetch(url, C3vkMode.MODERN);

        const incomingUser = buildUser(resp.data.article.author);
        let user = await UserService.getUserByIdWithoutCache(incomingUser.id!);
        if (user) {
            Object.assign(user, incomingUser);
        } else {
            user = User.create(incomingUser) as User;
        }
        await UserService.saveUser(user!);

        const data = resp.data.article;
        const hash = sha256(data.content);
        let article = await ArticleService.getArticleByIdWithoutCache(data.lid);
        if (article && article.contentHash === hash) {
            logger.info({ articleId: article.id }, 'Article content unchanged, skipping update');
            return;
        }
        const now = new Date();
        const incomingData: Partial<Article> = {
            title: data.title,
            authorId: data.author.uid,
            content: data.content,
            contentHash: hash,
            category: data.category as ArticleCategory,
            solutionForPid: data.solutionFor?.pid,
            upvote: data.upvote,
            favorCount: data.favorCount
        };

        if (article) {
            Object.assign(article, incomingData);
        } else {
            article = new Article();
            article.id = data.lid;
            article.createdAt = now;
            article.deleted = false;
            article.viewCount = 0;
            article.tags = [];
            article.priority = 0;
            Object.assign(article, incomingData);
        }
        await ArticleService.saveArticle(article);
        await ArticleHistoryService.pushNewVersion(article.id, article.content);
    }
}
module.exports = [
"[project]/db/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "automationBuilds",
    ()=>automationBuilds,
    "buildsRelations",
    ()=>buildsRelations,
    "organizationMembers",
    ()=>organizationMembers,
    "organizationMembersRelations",
    ()=>organizationMembersRelations,
    "organizations",
    ()=>organizations,
    "organizationsRelations",
    ()=>organizationsRelations,
    "projects",
    ()=>projects,
    "projectsRelations",
    ()=>projectsRelations,
    "resultsRelations",
    ()=>resultsRelations,
    "testCases",
    ()=>testCases,
    "testCasesRelations",
    ()=>testCasesRelations,
    "testResults",
    ()=>testResults,
    "users",
    ()=>users,
    "usersRelations",
    ()=>usersRelations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/mysql-core/table.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/mysql-core/columns/text.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/mysql-core/columns/timestamp.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/mysql-core/columns/int.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$json$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/mysql-core/columns/json.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/mysql-core/columns/varchar.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/mysql-core/indexes.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/relations.js [app-rsc] (ecmascript)");
;
;
const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mysqlTable"])('users', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('id', {
        length: 255
    }).primaryKey(),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('email', {
        length: 255
    }).notNull().unique(),
    firstName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('first_name', {
        length: 255
    }),
    lastName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('last_name', {
        length: 255
    }),
    imageUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('image_url'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').defaultNow().onUpdateNow().notNull()
});
const organizations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mysqlTable"])('organizations', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('id', {
        length: 255
    }).primaryKey(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('name', {
        length: 255
    }).notNull(),
    slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('slug', {
        length: 255
    }).notNull().unique(),
    ownerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('owner_id', {
        length: 255
    }).references(()=>users.id, {
        onDelete: 'cascade'
    }).notNull(),
    imageUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('image_url'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').defaultNow().onUpdateNow().notNull()
});
const organizationMembers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mysqlTable"])('organization_members', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('id').primaryKey().autoincrement(),
    organizationId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('organization_id', {
        length: 255
    }).references(()=>organizations.id, {
        onDelete: 'cascade'
    }).notNull(),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('user_id', {
        length: 255
    }).references(()=>users.id, {
        onDelete: 'cascade'
    }).notNull(),
    role: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('role', {
        length: 50
    }).default('member').notNull(),
    joinedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('joined_at').defaultNow().notNull()
}, (table)=>({
        // Use a regular index instead of unique index if causing issues
        orgUserUnique: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uniqueIndex"])('org_user_unique_idx').on(table.organizationId, table.userId)
    }));
const projects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mysqlTable"])('projects', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('id').primaryKey().autoincrement(),
    organizationId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('organization_id', {
        length: 255
    }).references(()=>organizations.id, {
        onDelete: 'cascade'
    }).notNull(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('name', {
        length: 255
    }).notNull(),
    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('description'),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('type', {
        length: 50
    }).notNull(),
    environment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('environment', {
        length: 50
    }).default('production'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').defaultNow().onUpdateNow().notNull()
}, (table)=>({
        orgIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["index"])('project_org_idx').on(table.organizationId)
    }));
const testCases = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mysqlTable"])('test_cases', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('id').primaryKey().autoincrement(),
    projectId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('project_id').references(()=>projects.id, {
        onDelete: 'cascade'
    }).notNull(),
    organizationId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('organization_id', {
        length: 255
    }).references(()=>organizations.id, {
        onDelete: 'cascade'
    }).notNull(),
    caseCode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('case_code', {
        length: 100
    }).notNull(),
    caseKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('case_key', {
        length: 100
    }),
    moduleName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('module_name', {
        length: 100
    }),
    testSuite: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('test_suite', {
        length: 100
    }),
    tags: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('tags'),
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('title').notNull(),
    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('description'),
    precondition: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('precondition'),
    steps: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('steps'),
    expectedResult: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('expected_result'),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('type', {
        length: 50
    }),
    priority: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('priority', {
        length: 20
    }).default('medium'),
    mode: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('mode', {
        length: 50
    }),
    createdById: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('created_by_id', {
        length: 255
    }).references(()=>users.id),
    shareableLink: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('shareable_link'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('updated_at').defaultNow().onUpdateNow().notNull()
}, (table)=>({
        orgCaseCodeUnique: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uniqueIndex"])('org_case_code_idx').on(table.organizationId, table.caseCode),
        projectIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["index"])('test_case_project_idx').on(table.projectId)
    }));
const automationBuilds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mysqlTable"])('automation_builds', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('id').primaryKey().autoincrement(),
    projectId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('project_id').references(()=>projects.id, {
        onDelete: 'cascade'
    }).notNull(),
    organizationId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('organization_id', {
        length: 255
    }).references(()=>organizations.id, {
        onDelete: 'cascade'
    }).notNull(),
    triggeredById: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('triggered_by_id', {
        length: 255
    }).references(()=>users.id),
    // sessionId to support parallel execution handshakes
    sessionId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('session_id', {
        length: 255
    }),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at').defaultNow().notNull(),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('status', {
        length: 50
    }).default('running').notNull(),
    environment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('environment', {
        length: 50
    }).default('dev'),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('type', {
        length: 50
    })
}, (table)=>({
        projectIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["index"])('build_project_idx').on(table.projectId),
        orgIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["index"])('build_org_idx').on(table.organizationId),
        projectSessionUniqueIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uniqueIndex"])('project_session_unique_idx').on(table.projectId, table.sessionId)
    }));
const testResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["mysqlTable"])('test_results', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('id').primaryKey().autoincrement(),
    buildId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('build_id').references(()=>automationBuilds.id, {
        onDelete: 'cascade'
    }).notNull(),
    projectId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["int"])('project_id').references(()=>projects.id, {
        onDelete: 'cascade'
    }).notNull(),
    organizationId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('organization_id', {
        length: 255
    }).references(()=>organizations.id, {
        onDelete: 'cascade'
    }).notNull(),
    specFile: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])('spec_file', {
        length: 512
    }).notNull(),
    tests: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$json$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["json"])('tests').notNull(),
    executedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('executed_at').defaultNow().notNull()
}, (table)=>({
        buildSpecUnique: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uniqueIndex"])('build_spec_idx').on(table.buildId, table.specFile),
        orgIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["index"])('result_org_idx').on(table.organizationId)
    }));
const usersRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(users, ({ many })=>({
        ownedOrganizations: many(organizations),
        memberships: many(organizationMembers),
        createdTestCases: many(testCases),
        triggeredBuilds: many(automationBuilds)
    }));
const organizationsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(organizations, ({ one, many })=>({
        owner: one(users, {
            fields: [
                organizations.ownerId
            ],
            references: [
                users.id
            ]
        }),
        members: many(organizationMembers),
        projects: many(projects),
        testCases: many(testCases),
        builds: many(automationBuilds),
        results: many(testResults)
    }));
const organizationMembersRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(organizationMembers, ({ one })=>({
        organization: one(organizations, {
            fields: [
                organizationMembers.organizationId
            ],
            references: [
                organizations.id
            ]
        }),
        user: one(users, {
            fields: [
                organizationMembers.userId
            ],
            references: [
                users.id
            ]
        })
    }));
const projectsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(projects, ({ one, many })=>({
        organization: one(organizations, {
            fields: [
                projects.organizationId
            ],
            references: [
                organizations.id
            ]
        }),
        testCases: many(testCases),
        builds: many(automationBuilds),
        results: many(testResults)
    }));
const testCasesRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(testCases, ({ one })=>({
        project: one(projects, {
            fields: [
                testCases.projectId
            ],
            references: [
                projects.id
            ]
        }),
        organization: one(organizations, {
            fields: [
                testCases.organizationId
            ],
            references: [
                organizations.id
            ]
        }),
        createdBy: one(users, {
            fields: [
                testCases.createdById
            ],
            references: [
                users.id
            ]
        })
    }));
const buildsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(automationBuilds, ({ one, many })=>({
        project: one(projects, {
            fields: [
                automationBuilds.projectId
            ],
            references: [
                projects.id
            ]
        }),
        organization: one(organizations, {
            fields: [
                automationBuilds.organizationId
            ],
            references: [
                organizations.id
            ]
        }),
        triggeredBy: one(users, {
            fields: [
                automationBuilds.triggeredById
            ],
            references: [
                users.id
            ]
        }),
        results: many(testResults)
    }));
const resultsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(testResults, ({ one })=>({
        build: one(automationBuilds, {
            fields: [
                testResults.buildId
            ],
            references: [
                automationBuilds.id
            ]
        }),
        project: one(projects, {
            fields: [
                testResults.projectId
            ],
            references: [
                projects.id
            ]
        }),
        organization: one(organizations, {
            fields: [
                testResults.organizationId
            ],
            references: [
                organizations.id
            ]
        })
    }));
}),
"[project]/db/index.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
// src/db/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tidbcloud$2f$serverless$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tidbcloud/serverless/dist/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$tidb$2d$serverless$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/tidb-serverless/driver.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db/schema.ts [app-rsc] (ecmascript)");
;
;
;
// Standard TiDB Serverless connection
const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tidbcloud$2f$serverless$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connect"])({
    url: process.env.DATABASE_URL
});
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$tidb$2d$serverless$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["drizzle"])(client, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
});
}),
"[project]/src/lib/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"004d67b87a94b84c07e1c0829aa32a3bb7c9163999":"getProjects","004e70dac2538b4f75d57982a114dea8e57b7f9d8f":"getMasterTestCases","0055717fbdfb18a464f81e2f160cd1eeb94dedb698":"getCypressGlobalStats","0068801bc5db575ce6c7feff1c3e7afb1702ae8b8b":"getCypressTrend","007302666b0b2d014f66aae626e03c633e01905a4a":"getBuildHistory","009c4ad3d954e65f7b81d562e36fe96ce80e7f264a":"getAutomationTrend","00beaa5cd31efc024c4d26dbe10411031ce7bc7e46":"getDashboardStats","40179009dd6b075f20f49baa8ce3a070a275278ec6":"getProjectManualStats","403a097f2d3620962f0abea18f2cbb4b743d527c70":"getProjectBuildHistory","404ce7fab94f6add1730b0e2d261257422becc81b1":"deleteTestCase","405ab82c81c26f9d1c87e2f546d82217cca71378d7":"createProject","40985fc7120685691fd2c858c055390f7a7d168fca":"getPlaywrightTrend","409b74923141062f58a7271c52755aa28c4e3d0336":"getProjectById","409ccbdfece1ce20f78f7ff2c167d4898bd86d3d3e":"getCypressBuildDetails","40ca70dd970133193d524385290976c9339abd1809":"createTestCase","40e4725a21160a2be0c52f3084c30fd679bed7e2be":"getBuildDetails","40ee964ccd603c653592809fdb53a685be624ae700":"getTestCasesByProject","601292f7ade18fa4dcc2557ca6917f9b29938180ca":"getBuildsByProjectAndType","60271fad021f2384bd70be0cdc0e79c7a9055fa091":"importTestCases","603cde4e095634d5ed90431e7daee3388cfe3dbeea":"uploadMasterTestCases","6069f3423eade358752d4385e9529e3c8fa13fdcde":"getTestSteps","606d2d2b7818c093a74d5a06678a987f7288b54846":"getCypressTestSteps","609856a59657476b0540c14b77e29cb4409a015f54":"updateTestCase","60eaa96af78c548f012dced88d66301232ff6680bd":"moveModule"},"",""] */ __turbopack_context__.s([
    "createProject",
    ()=>createProject,
    "createTestCase",
    ()=>createTestCase,
    "deleteTestCase",
    ()=>deleteTestCase,
    "getAutomationTrend",
    ()=>getAutomationTrend,
    "getBuildDetails",
    ()=>getBuildDetails,
    "getBuildHistory",
    ()=>getBuildHistory,
    "getBuildsByProjectAndType",
    ()=>getBuildsByProjectAndType,
    "getCypressBuildDetails",
    ()=>getCypressBuildDetails,
    "getCypressGlobalStats",
    ()=>getCypressGlobalStats,
    "getCypressTestSteps",
    ()=>getCypressTestSteps,
    "getCypressTrend",
    ()=>getCypressTrend,
    "getDashboardStats",
    ()=>getDashboardStats,
    "getMasterTestCases",
    ()=>getMasterTestCases,
    "getPlaywrightTrend",
    ()=>getPlaywrightTrend,
    "getProjectBuildHistory",
    ()=>getProjectBuildHistory,
    "getProjectById",
    ()=>getProjectById,
    "getProjectManualStats",
    ()=>getProjectManualStats,
    "getProjects",
    ()=>getProjects,
    "getTestCasesByProject",
    ()=>getTestCasesByProject,
    "getTestSteps",
    ()=>getTestSteps,
    "importTestCases",
    ()=>importTestCases,
    "moveModule",
    ()=>moveModule,
    "updateTestCase",
    ()=>updateTestCase,
    "uploadMasterTestCases",
    ()=>uploadMasterTestCases
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function getDashboardStats() {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) return {
            error: "Unauthorized"
        };
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) return {
            error: "No organization link found."
        };
        const orgId = membership.organizationId;
        // 1. Fetch Builds (Increase limit to ensure we see all)
        const builds = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id,
            projectId: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].projectId,
            projectName: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].name,
            status: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].status,
            environment: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].environment,
            type: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].type,
            createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].createdAt
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).leftJoin(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].projectId, __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].organizationId, orgId)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id)).limit(100); // 🟢 Increased limit
        // 2. Fetch all Projects for Tabs
        const orgProjects = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].organizationId, orgId));
        // 3. Fetch Requirement Count
        const totalRequirementsCount = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select({
            count: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`count(*)`
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].organizationId, orgId));
        // 4. Fetch Results
        const buildIds = builds.map((b)=>b.id);
        const rawResults = buildIds.length > 0 ? await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].buildId, buildIds), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].organizationId, orgId))) : [];
        // 5. 🟢 CRITICAL FIX: Ensure JSON 'tests' are parsed correctly
        const results = rawResults.map((r)=>{
            let parsedTests = [];
            try {
                parsedTests = typeof r.tests === 'string' ? JSON.parse(r.tests) : r.tests;
            } catch (e) {
                console.error(`Failed to parse JSON for build ${r.buildId}`);
            }
            return {
                ...r,
                tests: parsedTests
            };
        });
        return {
            builds,
            results,
            projects: orgProjects,
            totalRequirements: totalRequirementsCount[0]?.count || 0
        };
    } catch (error) {
        console.error("🔍 [DB_ERROR]:", error.message);
        return {
            error: error.message
        };
    }
}
async function getBuildHistory() {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id,
        status: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].status,
        environment: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].environment,
        createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].createdAt,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].type
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id)).limit(30);
}
async function getProjectBuildHistory(projectId) {
    try {
        // 1. Authenticate the Operator
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) return {
            error: "AUTH_REQUIRED"
        };
        // 2. Resolve Organization Context
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) return {
            error: "ORG_NOT_FOUND"
        };
        const orgId = membership.organizationId;
        // 3. Security Check: Verify Project belongs to User's Org
        const projectCheck = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.projects.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id, projectId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].organizationId, orgId))
        });
        if (!projectCheck) return {
            error: "ACCESS_DENIED_OR_INVALID_PROJECT"
        };
        // 4. Fetch Builds with Triggering User metadata
        // We join with the users table to show who started the build
        const builds = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id,
            status: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].status,
            environment: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].environment,
            type: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].type,
            createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].createdAt,
            triggeredBy: {
                name: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["users"].firstName,
                image: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["users"].imageUrl
            }
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).leftJoin(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["users"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].triggeredById, __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["users"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].projectId, projectId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].organizationId, orgId))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].createdAt));
        return {
            success: true,
            builds,
            projectName: projectCheck.name
        };
    } catch (error) {
        console.error("🔍 [REGISTRY_FETCH_FAILURE]:", error.message);
        return {
            error: "SYSTEM_RESOURCES_UNAVAILABLE"
        };
    }
}
const forceSlice = (val, limit, fallback = null)=>{
    if (val === undefined || val === null || val === "" || val === "-") return fallback;
    return String(val).trim().slice(0, limit);
};
async function importTestCases(projectId, dataArray) {
    try {
        // 1. GET AUTH CONTEXT
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) return {
            success: false,
            error: "Unauthorized"
        };
        // 2. GET USER'S ORGANIZATION ID
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) return {
            success: false,
            error: "No organization found for user"
        };
        const orgId = membership.organizationId;
        // 3. MAP DATA TO SCHEMA (Injecting orgId and projectId)
        const formattedData = dataArray.map((item, index)=>{
            const find = (key)=>{
                const normalizedSearch = key.toLowerCase().replace(/[\s_]/g, "");
                const targetKey = Object.keys(item).find((actualKey)=>{
                    return actualKey.toLowerCase().replace(/[\s_]/g, "") === normalizedSearch;
                });
                return targetKey ? item[targetKey] : undefined;
            };
            return {
                projectId: Number(projectId),
                organizationId: orgId,
                caseCode: forceSlice(find('caseCode') || find('case_code'), 100) || `TC-AUTO-${Date.now()}-${index}`,
                caseKey: forceSlice(find('caseKey'), 100),
                moduleName: forceSlice(find('moduleName') || find('module_name'), 100, 'GENERAL'),
                testSuite: forceSlice(find('testSuite') || find('test_suite'), 100),
                title: String(find('title') || 'Untitled Case'),
                description: find('description') ? String(find('description')) : null,
                precondition: find('precondition') ? String(find('precondition')) : null,
                steps: find('steps') ? String(find('steps')) : null,
                expectedResult: find('expectedResult') || find('expected_result') ? String(find('expectedResult') || find('expected_result')) : null,
                priority: forceSlice(find('priorities') || find('priority'), 20, 'medium'),
                mode: forceSlice(find('mode'), 50, 'manual'),
                type: forceSlice(find('type'), 50, 'standard'),
                createdById: userId,
                shareableLink: find('shareableTestCaseDetails') || find('shareable_link') ? String(find('shareableTestCaseDetails') || find('shareable_link')) : null,
                tags: find('tags') ? String(find('tags')) : null
            };
        });
        // 4. CHUNKED BATCH UPSERT (Optimized for TiDB)
        const chunkSize = 40;
        for(let i = 0; i < formattedData.length; i += chunkSize){
            const chunk = formattedData.slice(i, i + chunkSize);
            await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).values(chunk).onDuplicateKeyUpdate({
                set: {
                    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`VALUES(title)`,
                    //@ts-ignore
                    module_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`VALUES(module_name)`,
                    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`VALUES(description)`,
                    steps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`VALUES(steps)`,
                    expected_result: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`VALUES(expected_result)`,
                    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`VALUES(priority)`,
                    tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`VALUES(tags)`,
                    updatedAt: new Date()
                }
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/projects/${projectId}/manual`);
        return {
            success: true,
            count: formattedData.length
        };
    } catch (error) {
        console.error("IMPORT_CRITICAL_ERROR:", error);
        return {
            success: false,
            error: error.message
        };
    }
}
async function getBuildDetails(buildId) {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return {
                error: 'Unauthorized'
            };
        }
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) {
            return {
                error: 'No organization found'
            };
        }
        const build = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id, buildId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].organizationId, membership.organizationId))).limit(1);
        if (!build || build.length === 0) {
            // Debug: Check if build exists without org filter
            const buildWithoutOrg = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id, buildId)).limit(1);
            if (buildWithoutOrg.length > 0) {}
            return null;
        }
        const buildData = build[0];
        let project = null;
        if (buildData.projectId) {
            const projectResult = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id, buildData.projectId)).limit(1);
            project = projectResult[0] || null;
        }
        let triggeredBy = null;
        if (buildData.triggeredById) {
            const userResult = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["users"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["users"].id, buildData.triggeredById)).limit(1);
            triggeredBy = userResult[0] || null;
        }
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].buildId, buildId));
        const finalResult = {
            ...buildData,
            project: project,
            triggeredBy: triggeredBy,
            results: results.map((r)=>({
                    ...r,
                    tests: Array.isArray(r.tests) ? r.tests.map((t)=>({
                            ...t,
                            has_details: !!(t.steps?.length || t.logs?.length || t.error)
                        })) : []
                }))
        };
        return finalResult;
    } catch (e) {
        console.error('❌ getBuildDetails error:', e.message);
        console.error('   Stack:', e.stack);
        return null;
    }
}
async function updateTestCase(id, data) {
    try {
        const { id: _, createdAt, updatedAt, ...updateData } = data;
        await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).set({
            ...updateData,
            updatedAt: new Date()
        }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].id, id));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/test-cases');
        return {
            success: true
        };
    } catch (error) {
        console.error("❌ Update Error:", error);
        return {
            error: error.message
        };
    }
}
async function uploadMasterTestCases(data, projectId) {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return {
                error: 'Unauthorized'
            };
        }
        // Get user's organization
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) {
            return {
                error: 'No organization found'
            };
        }
        // Verify project belongs to user's organization
        const project = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.projects.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id, projectId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].organizationId, membership.organizationId))
        });
        if (!project) {
            return {
                error: 'Project not found or access denied'
            };
        }
        let inserted = 0;
        let updated = 0;
        let skipped = 0;
        for (const item of data){
            const code = item['Case code'] || item.caseCode;
            const title = item['Title'] || item.title;
            if (!code || !title) {
                skipped++;
                continue;
            }
            // Check if test case already exists for this org
            const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.testCases.findFirst({
                where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].organizationId, membership.organizationId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].caseCode, String(code)))
            });
            if (existing) {
                // Update existing test case
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).set({
                    title: String(title),
                    moduleName: String(item['ModuleName'] || item['Module Name'] || ''),
                    testSuite: String(item['Test Suite'] || ''),
                    description: String(item['Description'] || ''),
                    precondition: String(item['Precondition'] || ''),
                    steps: String(item['Steps'] || ''),
                    expectedResult: String(item['ExpectedResult'] || ''),
                    type: String(item['Type'] || ''),
                    priority: String(item['Priorities'] || item.priority || 'medium'),
                    mode: String(item['Mode'] || 'Automation'),
                    tags: String(item['Tags'] || '')
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].id, existing.id));
                updated++;
            } else {
                // Insert new test case
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).values({
                    projectId: projectId,
                    organizationId: membership.organizationId,
                    caseCode: String(code),
                    caseKey: String(item['Case API Key'] || item['Case Key'] || ''),
                    moduleName: String(item['ModuleName'] || item['Module Name'] || ''),
                    testSuite: String(item['Test Suite'] || ''),
                    title: String(title),
                    description: String(item['Description'] || ''),
                    precondition: String(item['Precondition'] || ''),
                    steps: String(item['Steps'] || ''),
                    expectedResult: String(item['ExpectedResult'] || ''),
                    type: String(item['Type'] || ''),
                    priority: String(item['Priorities'] || item.priority || 'medium'),
                    mode: String(item['Mode'] || 'Automation'),
                    createdById: userId,
                    tags: String(item['Tags'] || '')
                });
                inserted++;
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/test-cases');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/projects/${projectId}`);
        return {
            success: true,
            stats: {
                total: data.length,
                inserted,
                updated,
                skipped
            }
        };
    } catch (e) {
        console.error('❌ TiDB Insert Error:', e);
        return {
            error: e.message
        };
    }
}
async function getPlaywrightTrend(projectId) {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return {
                error: 'Unauthorized'
            };
        }
        // Get user's organization
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) {
            return {
                error: 'No organization found'
            };
        }
        // Build query conditions
        const conditions = [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].type, 'playwright'),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].organizationId, membership.organizationId)
        ];
        // Optionally filter by project
        if (projectId) {
            conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].projectId, projectId));
        }
        // Get last 10 builds
        const builds = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])(...conditions)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id)).limit(10);
        if (builds.length === 0) return [];
        const buildIds = builds.map((b)=>b.id);
        // Get results for these builds
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].buildId, buildIds), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].organizationId, membership.organizationId)));
        // Calculate trend data
        return builds.map((b)=>{
            let passed = 0, failed = 0, total = 0;
            const buildSpecs = results.filter((r)=>r.buildId === b.id);
            buildSpecs.forEach((spec)=>{
                spec.tests?.forEach((t)=>{
                    if (t.is_final) {
                        total++;
                        const status = t.status?.toLowerCase();
                        if ([
                            'passed',
                            'expected',
                            'success'
                        ].includes(status)) {
                            passed++;
                        } else if ([
                            'failed',
                            'unexpected',
                            'error'
                        ].includes(status)) {
                            failed++;
                        }
                    }
                });
            });
            return {
                name: `#${b.id}`,
                passed,
                failed,
                total,
                passRate: total > 0 ? Math.round(passed / total * 100) : 0
            };
        }).reverse();
    } catch (e) {
        console.error('getPlaywrightTrend error:', e.message);
        return [];
    }
}
async function getTestSteps(specId, testTitle) {
    try {
        // Query the testResults table with the specId
        const testResult = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.testResults.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].id, specId)
        });
        if (!testResult) return null;
        // Parse the tests if it's stored as JSON string
        const testsArray = typeof testResult.tests === 'string' ? JSON.parse(testResult.tests) : testResult.tests;
        // Find the test by title in the tests array
        const test = testsArray.find((t)=>t.title === testTitle);
        if (!test) return null;
        return {
            steps: test.steps || [],
            logs: test.logs || [],
            stdout_logs: test.stdout_logs || test.logs || [],
            stderr_logs: test.stderr_logs || [],
            error: test.error || null,
            video_url: test.video_url || null
        };
    } catch (error) {
        console.error('Error fetching test steps:', error);
        return null;
    }
}
async function getCypressTestSteps(specId, testTitle) {
    try {
        // 1. Query the testResults table using the specId (Primary Key)
        const testResult = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.testResults.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].id, specId)
        });
        if (!testResult) return null;
        // 2. Handle TiDB JSON parsing (Drizzle usually returns an object, but we check for safety)
        const testsArray = typeof testResult.tests === 'string' ? JSON.parse(testResult.tests) : testResult.tests;
        // 3. Find the specific test by title in the Cypress results array
        const test = testsArray.find((t)=>t.title === testTitle);
        if (!test) return null;
        return {
            steps: test.steps || [],
            logs: test.logs || [],
            // Cypress often uses 'logs' for all terminal output
            stdout_logs: test.logs || [],
            stderr_logs: test.stderr_logs || [],
            error: test.error || null,
            video_url: test.video_url || null,
            stack_trace: test.stack_trace || test.error?.stack || null
        };
    } catch (error) {
        return null;
    }
}
async function getMasterTestCases() {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.testCases.findMany({
        orderBy: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].updatedAt)
        ]
    });
}
async function getCypressGlobalStats() {
    try {
        const builds = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].type, 'cypress'));
        // Fetch all test results for Cypress builds
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select({
            tests: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].tests
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id, __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].buildId)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].type, 'cypress'));
        let totalTests = 0;
        let passedTests = 0;
        results.forEach((r)=>{
            const tests = r.tests || [];
            totalTests += tests.length;
            passedTests += tests.filter((t)=>t.status === 'passed').length;
        });
        // ✅ Match the naming expected by the frontend
        return {
            totalBuilds: builds.length || 0,
            totalTestsExecuted: totalTests || 0,
            lifetimePassRate: totalTests > 0 ? Math.round(passedTests / totalTests * 100) : 0
        };
    } catch (error) {
        console.error("Global Stats Error:", error);
        return {
            totalBuilds: 0,
            totalTestsExecuted: 0,
            lifetimePassRate: 0
        };
    }
}
async function getCypressBuildDetails(buildId) {
    try {
        // 1. Fetch the build metadata
        const build = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.automationBuilds.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id, buildId)
        });
        if (!build) return null;
        // 2. Fetch all spec rows associated with this build
        // This avoids the Lateral Join syntax error in TiDB
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].buildId, buildId));
        // 3. Enrich the results with spec-level analytics
        const enrichedResults = results.map((r)=>{
            // TiDB returns the JSON column as a live JavaScript array
            const tests = r.tests || [];
            const specPassed = tests.filter((t)=>t.status === 'passed').length;
            const specFailed = tests.filter((t)=>t.status === 'failed').length;
            const specPending = tests.filter((t)=>[
                    'pending',
                    'skipped'
                ].includes(t.status)).length;
            // Calculate total spec duration (Handling strings like "1500ms" or raw numbers)
            const totalDurationMs = tests.reduce((acc, t)=>{
                const d = typeof t.duration === 'string' ? parseInt(t.duration) : t.duration || 0;
                return acc + d;
            }, 0);
            // Extract environment info from the first test in the spec
            const firstTest = tests[0] || {};
            return {
                ...r,
                // Spec-level summary
                stats: {
                    total: tests.length,
                    passed: specPassed,
                    failed: specFailed,
                    pending: specPending,
                    duration: totalDurationMs > 1000 ? (totalDurationMs / 1000).toFixed(2) + "s" : totalDurationMs + "ms"
                },
                // Environment Details for this specific worker/spec
                envInfo: {
                    browser: firstTest.browser || 'unknown',
                    browserVersion: firstTest.browser_version || 'N/A',
                    os: firstTest.os || 'unknown',
                    project: firstTest.project || 'Cypress'
                },
                // We pass the light version of the test list initially
                // Logs and steps will be lazy-loaded by 'getCypressTestSteps'
                tests: tests.map((t)=>({
                        title: t.title,
                        status: t.status,
                        duration: t.duration,
                        run_number: t.run_number,
                        case_codes: t.case_codes || [
                            "N/A"
                        ],
                        error: t.error ? {
                            message: t.error.message
                        } : null,
                        has_details: !!(t.steps?.length || t.logs?.length)
                    }))
            };
        });
        return {
            ...build,
            results: enrichedResults
        };
    } catch (error) {
        console.error(`❌ Error fetching details for Cypress build ${buildId}:`, error.message);
        return null;
    }
}
async function getCypressTrend() {
    const builds = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].type, 'cypress')).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].id)).limit(10);
    if (builds.length === 0) return [];
    const buildIds = builds.map((b)=>b.id);
    const results = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testResults"].buildId, buildIds));
    return builds.map((b)=>{
        let p = 0, t = 0;
        results.filter((r)=>r.buildId === b.id).forEach((spec)=>{
            spec.tests.forEach((test)=>{
                t++;
                if (test.status === 'passed') p++;
            });
        });
        return {
            name: `#${b.id}`,
            passed: p,
            total: t
        };
    }).reverse();
}
async function deleteTestCase(id) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].id, id));
        return {
            success: true
        };
    } catch (e) {
        console.error("DELETE_ERROR:", e.message);
        return {
            error: e.message
        };
    }
}
async function moveModule(oldPath, newPath) {
    try {
        // Finds all test cases starting with the old folder path and renames them
        // SQL: UPDATE test_cases SET module_name = REPLACE(module_name, 'Old', 'New') 
        // WHERE module_name LIKE 'Old%'
        await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).set({
            moduleName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`REPLACE(${__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].moduleName}, ${oldPath}, ${newPath})`,
            updatedAt: new Date()
        }).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].moduleName} LIKE ${oldPath + '%'}`);
        return {
            success: true
        };
    } catch (e) {
        return {
            error: e.message
        };
    }
}
async function getAutomationTrend() {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].execute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT DATE(updated_at) as date, COUNT(*) as count
      FROM test_cases
      WHERE mode = 'Automation' AND updated_at >= DATE_SUB(CURDATE(), INTERVAL 10 DAY)
      GROUP BY DATE(updated_at) ORDER BY date ASC
    `);
        const rows = result[0] || [];
        const statsMap = new Map(rows.map((r)=>[
                new Date(r.date).toISOString().split('T')[0],
                r.count
            ]));
        const trendData = [];
        for(let i = 9; i >= 0; i--){
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            trendData.push({
                name: d.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit'
                }),
                automated: statsMap.get(dateStr) || 0
            });
        }
        return trendData;
    } catch (e) {
        return [];
    }
}
async function createProject(formData) {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }
        // Get user's organization
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) {
            return {
                success: false,
                error: 'No organization found'
            };
        }
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"]).values({
            organizationId: membership.organizationId,
            name: formData.name.toUpperCase(),
            type: formData.type.toLowerCase(),
            environment: formData.environment.toLowerCase(),
            description: formData.description || ''
        });
        const insertedId = res.lastInsertId || res[0]?.insertId;
        // Revalidate paths
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/projects');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/dashboard');
        return {
            success: true,
            id: insertedId
        };
    } catch (error) {
        console.error('Project Creation Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to register project'
        };
    }
}
async function getProjects() {
    const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
    if (!userId) {
        return [];
    }
    // Get user's organization
    const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
        where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
    });
    if (!membership) {
        return [];
    }
    // Fetch projects for the user's organization
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id,
        name: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].name,
        type: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].type,
        environment: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].environment,
        description: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].description,
        organizationId: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].organizationId,
        createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].createdAt,
        // Count builds linked to this project
        executionCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`(SELECT COUNT(*) FROM automation_builds WHERE automation_builds.project_id = ${__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id})`,
        // Count test cases linked to this project
        totalCases: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`(SELECT COUNT(*) FROM test_cases WHERE test_cases.project_id = ${__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id})`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].organizationId, membership.organizationId));
    // Map to add UI colors
    const colors = [
        'indigo',
        'amber',
        'emerald',
        'rose',
        'cyan',
        'violet'
    ];
    return result.map((p, index)=>({
            ...p,
            color: colors[index % colors.length],
            coverage: p.totalCases > 0 ? '100%' : '0%'
        }));
}
async function getProjectById(id) {
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id, id));
    return res[0];
}
async function getBuildsByProjectAndType(projectId, type) {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return {
                error: 'Unauthorized'
            };
        }
        // Get user's organization
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) {
            return {
                error: 'No organization found'
            };
        }
        // Verify project belongs to user's organization
        const project = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id, projectId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].organizationId, membership.organizationId))).limit(1);
        if (!project || project.length === 0) {
            return {
                error: 'Project not found or access denied'
            };
        }
        // Get builds for this project and type
        const builds = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].projectId, projectId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].type, type.toLowerCase()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].organizationId, membership.organizationId))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["automationBuilds"].createdAt));
        return builds;
    } catch (e) {
        console.error('getBuildsByProjectAndType error:', e.message);
        return {
            error: e.message
        };
    }
}
async function getTestCasesByProject(projectId) {
    return await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].projectId, projectId)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].createdAt));
}
async function createTestCase(data) {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return {
                success: false,
                error: 'Unauthorized'
            };
        }
        // Get user's organization
        const membership = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.organizationMembers.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["organizationMembers"].userId, userId)
        });
        if (!membership) {
            return {
                success: false,
                error: 'No organization found'
            };
        }
        // Verify project belongs to user's organization
        const project = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.projects.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].id, Number(data.projectId)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["projects"].organizationId, membership.organizationId))
        });
        if (!project) {
            return {
                success: false,
                error: 'Project not found or access denied'
            };
        }
        // Check if case code already exists in this organization
        const existingCase = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].query.testCases.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].organizationId, membership.organizationId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].caseCode, data.caseCode.toUpperCase()))
        });
        if (existingCase) {
            return {
                success: false,
                error: 'Case code already exists'
            };
        }
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).values({
            projectId: Number(data.projectId),
            organizationId: membership.organizationId,
            createdById: userId,
            caseCode: data.caseCode.toUpperCase(),
            title: data.title,
            moduleName: data.moduleName || 'GENERAL',
            priority: data.priority || 'medium',
            steps: data.steps || '',
            expectedResult: data.expectedResult || '',
            description: data.description || '',
            precondition: data.precondition || '',
            testSuite: data.testSuite || '',
            tags: data.tags || '',
            type: 'manual'
        });
        const insertedId = res.lastInsertId || res[0]?.insertId;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/projects/${data.projectId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/projects/${data.projectId}/manual`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/test-cases');
        return {
            success: true,
            id: insertedId
        };
    } catch (error) {
        console.error('DB Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
async function getProjectManualStats(projectId) {
    const allCases = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["testCases"].projectId, projectId));
    // Group by Module
    const modules = allCases.reduce((acc, tc)=>{
        const mod = tc.moduleName || "UNASSIGNED";
        if (!acc[mod]) acc[mod] = {
            name: mod,
            auto: 0,
            man: 0,
            total: 0
        };
        acc[mod].total++;
        // Logic: If mode is 'Automation' it counts as Auto, else Manual
        if (tc.mode?.toLowerCase() === 'automation') acc[mod].auto++;
        else acc[mod].man++;
        return acc;
    }, {});
    const total = allCases.length;
    const auto = allCases.filter((c)=>c.mode?.toLowerCase() === 'automation').length;
    const man = total - auto;
    return {
        stats: {
            total,
            auto,
            man,
            roi: total > 0 ? Math.round(auto / total * 100) : 0
        },
        moduleList: Object.values(modules)
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getDashboardStats,
    getBuildHistory,
    getProjectBuildHistory,
    importTestCases,
    getBuildDetails,
    updateTestCase,
    uploadMasterTestCases,
    getPlaywrightTrend,
    getTestSteps,
    getCypressTestSteps,
    getMasterTestCases,
    getCypressGlobalStats,
    getCypressBuildDetails,
    getCypressTrend,
    deleteTestCase,
    moveModule,
    getAutomationTrend,
    createProject,
    getProjects,
    getProjectById,
    getBuildsByProjectAndType,
    getTestCasesByProject,
    createTestCase,
    getProjectManualStats
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDashboardStats, "00beaa5cd31efc024c4d26dbe10411031ce7bc7e46", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getBuildHistory, "007302666b0b2d014f66aae626e03c633e01905a4a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProjectBuildHistory, "403a097f2d3620962f0abea18f2cbb4b743d527c70", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(importTestCases, "60271fad021f2384bd70be0cdc0e79c7a9055fa091", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getBuildDetails, "40e4725a21160a2be0c52f3084c30fd679bed7e2be", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateTestCase, "609856a59657476b0540c14b77e29cb4409a015f54", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(uploadMasterTestCases, "603cde4e095634d5ed90431e7daee3388cfe3dbeea", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPlaywrightTrend, "40985fc7120685691fd2c858c055390f7a7d168fca", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTestSteps, "6069f3423eade358752d4385e9529e3c8fa13fdcde", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCypressTestSteps, "606d2d2b7818c093a74d5a06678a987f7288b54846", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMasterTestCases, "004e70dac2538b4f75d57982a114dea8e57b7f9d8f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCypressGlobalStats, "0055717fbdfb18a464f81e2f160cd1eeb94dedb698", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCypressBuildDetails, "409ccbdfece1ce20f78f7ff2c167d4898bd86d3d3e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCypressTrend, "0068801bc5db575ce6c7feff1c3e7afb1702ae8b8b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteTestCase, "404ce7fab94f6add1730b0e2d261257422becc81b1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(moveModule, "60eaa96af78c548f012dced88d66301232ff6680bd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAutomationTrend, "009c4ad3d954e65f7b81d562e36fe96ce80e7f264a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createProject, "405ab82c81c26f9d1c87e2f546d82217cca71378d7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProjects, "004d67b87a94b84c07e1c0829aa32a3bb7c9163999", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProjectById, "409b74923141062f58a7271c52755aa28c4e3d0336", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getBuildsByProjectAndType, "601292f7ade18fa4dcc2557ca6917f9b29938180ca", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTestCasesByProject, "40ee964ccd603c653592809fdb53a685be624ae700", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTestCase, "40ca70dd970133193d524385290976c9339abd1809", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProjectManualStats, "40179009dd6b075f20f49baa8ce3a070a275278ec6", null);
}),
];

//# sourceMappingURL=_c861e078._.js.map
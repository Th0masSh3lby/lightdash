import { SupportedDbtAdapter } from '../types/dbt';
import { Explore, Table } from '../types/explore';
import { DimensionType, FieldType, MetricType, Source } from '../types/field';
import { FilterOperator } from '../types/filter';
import { CreateWarehouseCredentials } from '../types/projects';
import { WarehouseClient } from '../types/warehouse';
import { UncompiledExplore } from './exploreCompiler';

export const warehouseClientMock: WarehouseClient = {
    credentials: {} as CreateWarehouseCredentials,
    getCatalog: async () => ({
        default: {
            public: {
                table: {
                    id: DimensionType.NUMBER,
                },
            },
        },
    }),
    runQuery: () =>
        Promise.resolve({
            fields: {},
            rows: [],
        }),
    test: () => Promise.resolve(),
    getStartOfWeek: () => undefined,
    getFieldQuoteChar: () => '"',
    getStringQuoteChar: () => "'",
    getEscapeStringQuoteChar: () => "'",
    getMetricSql: (sql, metric) => {
        switch (metric.type) {
            case MetricType.AVERAGE:
                return `AVG(${sql})`;
            case MetricType.MAX:
                return `MAX(${sql})`;
            case MetricType.SUM:
                return `SUM(${sql})`;
            default:
                return sql;
        }
    },
};

const sourceMock: Source = {
    path: '',
    content: '',
    range: {
        start: {
            line: 0,
            character: 0,
        },
        end: {
            line: 0,
            character: 0,
        },
    },
};

export const exploreBase: Explore = {
    targetDatabase: SupportedDbtAdapter.POSTGRES,
    name: '',
    label: '',
    tags: [],
    baseTable: 'a',
    joinedTables: [],
    tables: {},
    groupLabel: undefined,
};

export const exploreOneEmptyTable: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {},
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
            groupLabel: undefined,
        },
    },
};

export const exploreOneEmptyTableCompiled: Explore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {},
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
            groupLabel: undefined,
        },
    },
};

export const exploreMissingBaseTable: UncompiledExplore = {
    ...exploreBase,
};

export const exploreMissingJoinTable: UncompiledExplore = {
    ...exploreBase,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '',
        },
    ],
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {},
            metrics: {},
            lineageGraph: {},
            source: sourceMock,
            groupLabel: undefined,
        },
    },
};

export const exploreCircularDimensionReference: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${a.dim1}', // circular reference
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreCircularDimensionShortReference: UncompiledExplore = {
    ...exploreCircularDimensionReference,
    tables: {
        a: {
            ...exploreCircularDimensionReference.tables.a,
            dimensions: {
                dim1: {
                    ...exploreCircularDimensionReference.tables.a.dimensions
                        .dim1,
                    sql: '${dim1}', // circular short reference
                },
            },
        },
    },
};

export const exploreCircularMetricReference: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {
                met1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.STRING,
                    name: 'met1',
                    label: 'met1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${a.met1}', // circular reference
                    source: sourceMock,
                    hidden: false,
                    isAutoGenerated: false,
                },
            },
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreCircularMetricShortReference: UncompiledExplore = {
    ...exploreCircularDimensionReference,
    tables: {
        a: {
            ...exploreCircularDimensionReference.tables.a,
            metrics: {
                met1: {
                    ...exploreCircularDimensionReference.tables.a.metrics.met1,
                    sql: '${met1}', // circular short reference
                },
            },
        },
    },
};

export const exploreTableSelfReference: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreTableSelfReferenceCompiled: Explore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim1',
                    compiledSql: '"a".dim1',
                    tablesReferences: ['a'],
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreReferenceDimension: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                    hidden: false,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim2',
                    label: 'dim2',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${a.dim1}',
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreReferenceDimensionCompiled: Explore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim1',
                    compiledSql: '"a".dim1',
                    tablesReferences: ['a'],
                    source: sourceMock,
                    hidden: false,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim2',
                    label: 'dim2',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${a.dim1}',
                    compiledSql: '("a".dim1)',
                    tablesReferences: ['a'],
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};
export const exploreComplexReference: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                    hidden: false,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim2',
                    label: 'dim2',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${a.dim1}',
                    source: sourceMock,
                    hidden: false,
                },
                dim3: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim3',
                    label: 'dim3',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim3 + ${a.dim2} + ${dim1}',
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {
                m1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.AVERAGE,
                    name: 'm1',
                    label: 'm1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${dim3}',
                    source: sourceMock,
                    isAutoGenerated: false,
                    hidden: false,
                },
            },
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreComplexReferenceCompiled: Explore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim1',
                    compiledSql: '"a".dim1',
                    tablesReferences: ['a'],
                    source: sourceMock,
                    hidden: false,
                },
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim2',
                    label: 'dim2',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${a.dim1}',
                    compiledSql: '("a".dim1)',
                    tablesReferences: ['a'],
                    source: sourceMock,
                    hidden: false,
                },
                dim3: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim3',
                    label: 'dim3',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim3 + ${a.dim2} + ${dim1}',
                    compiledSql: '"a".dim3 + (("a".dim1)) + ("a".dim1)',
                    tablesReferences: ['a'],
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {
                m1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.AVERAGE,
                    name: 'm1',
                    label: 'm1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${dim3}',
                    compiledSql: 'AVG(("a".dim3 + (("a".dim1)) + ("a".dim1)))',
                    tablesReferences: ['a'],
                    source: sourceMock,
                    isAutoGenerated: false,
                    hidden: false,
                },
            },
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const simpleJoinedExplore: UncompiledExplore = {
    ...exploreBase,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '${a.dim1} = ${b.dim1}',
        },
    ],
    tables: {
        a: {
            name: 'a',
            label: 'Custom A label',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'Custom A label',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
        b: {
            name: 'b',
            label: 'Custom B label',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.tableb',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'b',
                    tableLabel: 'Custom B label',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const compiledSimpleJoinedExplore: Explore = {
    ...exploreBase,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '${a.dim1} = ${b.dim1}',
            compiledSqlOn: '("a".dim1) = ("b".dim1)',
        },
    ],
    tables: {
        a: {
            name: 'a',
            label: 'Custom A label',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'Custom A label',
                    sql: '${TABLE}.dim1',
                    compiledSql: '"a".dim1',
                    tablesReferences: ['a'],
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
        b: {
            name: 'b',
            label: 'Custom B label',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.tableb',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'b',
                    tableLabel: 'Custom B label',
                    sql: '${TABLE}.dim1',
                    compiledSql: '"b".dim1',
                    tablesReferences: ['b'],
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreReferenceInJoin: UncompiledExplore = {
    ...simpleJoinedExplore,
    tables: {
        ...simpleJoinedExplore.tables,
        b: {
            ...simpleJoinedExplore.tables.b,
            dimensions: {
                ...simpleJoinedExplore.tables.b.dimensions,
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim2',
                    label: 'dim2',
                    table: 'b',
                    tableLabel: 'Custom B label',
                    sql: '${a.dim1}',
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreReferenceInJoinCompiled: Explore = {
    ...compiledSimpleJoinedExplore,
    tables: {
        ...compiledSimpleJoinedExplore.tables,
        b: {
            ...compiledSimpleJoinedExplore.tables.b,
            dimensions: {
                ...compiledSimpleJoinedExplore.tables.b.dimensions,
                dim2: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim2',
                    label: 'dim2',
                    table: 'b',
                    tableLabel: 'Custom B label',
                    sql: '${a.dim1}',
                    compiledSql: '("a".dim1)',
                    tablesReferences: ['b', 'a'],
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {},
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const joinedExploreOverridingJoinLabel: UncompiledExplore = {
    ...simpleJoinedExplore,
    joinedTables: [
        {
            ...simpleJoinedExplore.joinedTables[0],
            label: 'Custom join label',
        },
    ],
};
export const compiledJoinedExploreOverridingJoinLabel: Explore = {
    ...compiledSimpleJoinedExplore,
    tables: {
        ...compiledSimpleJoinedExplore.tables,
        b: {
            ...compiledSimpleJoinedExplore.tables.b,
            label: 'Custom join label',
            dimensions: {
                ...compiledSimpleJoinedExplore.tables.b.dimensions,
                dim1: {
                    ...compiledSimpleJoinedExplore.tables.b.dimensions.dim1,
                    tableLabel: 'Custom join label',
                },
            },
        },
    },
};

export const joinedExploreOverridingJoinAlias: UncompiledExplore = {
    ...simpleJoinedExplore,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '${a.dim1} = ${custom_alias.dim1}',
            alias: 'custom_alias',
        },
    ],
};

export const compiledJoinedExploreOverridingJoinAlias: Explore = {
    ...compiledSimpleJoinedExplore,
    joinedTables: [
        {
            table: 'custom_alias',
            sqlOn: '${a.dim1} = ${custom_alias.dim1}',
            compiledSqlOn: '("a".dim1) = ("custom_alias".dim1)',
        },
    ],
    tables: {
        a: compiledSimpleJoinedExplore.tables.a,
        custom_alias: {
            ...compiledSimpleJoinedExplore.tables.b,
            name: 'custom_alias',
            label: 'Custom alias',
            dimensions: {
                ...compiledSimpleJoinedExplore.tables.b.dimensions,
                dim1: {
                    ...compiledSimpleJoinedExplore.tables.b.dimensions.dim1,
                    table: 'custom_alias',
                    tableLabel: 'Custom alias',
                    compiledSql: '"custom_alias".dim1',
                    tablesReferences: ['custom_alias'],
                },
            },
        },
    },
};

export const joinedExploreOverridingAliasAndLabel: UncompiledExplore = {
    ...simpleJoinedExplore,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '${a.dim1} = ${custom_alias.dim1}',
            label: 'Custom join label',
            alias: 'custom_alias',
        },
    ],
};

export const compiledJoinedExploreOverridingAliasAndLabel: Explore = {
    ...compiledSimpleJoinedExplore,
    joinedTables: [
        {
            table: 'custom_alias',
            sqlOn: '${a.dim1} = ${custom_alias.dim1}',
            compiledSqlOn: '("a".dim1) = ("custom_alias".dim1)',
        },
    ],
    tables: {
        a: compiledSimpleJoinedExplore.tables.a,
        custom_alias: {
            ...compiledSimpleJoinedExplore.tables.b,
            name: 'custom_alias',
            label: 'Custom join label',
            dimensions: {
                ...compiledSimpleJoinedExplore.tables.b.dimensions,
                dim1: {
                    ...compiledSimpleJoinedExplore.tables.b.dimensions.dim1,
                    table: 'custom_alias',
                    tableLabel: 'Custom join label',
                    compiledSql: '"custom_alias".dim1',
                    tablesReferences: ['custom_alias'],
                },
            },
        },
    },
};

export const joinedExploreWithSubsetOfFields: UncompiledExplore = {
    ...exploreReferenceInJoin,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '${a.dim1} = ${b.dim1}',
            fields: ['dim1'],
        },
    ],
};

export const joinedExploreWithSubsetOfFieldsCausingError: UncompiledExplore = {
    ...exploreReferenceInJoin,
    joinedTables: [
        {
            table: 'b',
            sqlOn: '${a.dim1} = ${b.dim1}',
            fields: ['dim2'], // not possible because it dim1 is also needed for the join sql
        },
    ],
};

export const compiledJoinedExploreWithSubsetOfFields: Explore = {
    ...exploreReferenceInJoinCompiled,
    tables: {
        ...exploreReferenceInJoinCompiled.tables,
        b: {
            ...exploreReferenceInJoinCompiled.tables.b,
            dimensions: {
                dim1: {
                    ...exploreReferenceInJoinCompiled.tables.b.dimensions.dim1,
                },
            },
        },
    },
};

export const exploreWithMetricNumber: UncompiledExplore = {
    ...exploreBase,
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.NUMBER,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${TABLE}.dim1',
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {
                m1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.SUM,
                    name: 'm1',
                    label: 'm1',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '${dim1}',
                    source: sourceMock,
                    isAutoGenerated: false,
                    hidden: false,
                },
                m2: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.NUMBER,
                    name: 'm2',
                    label: 'm2',
                    table: 'a',
                    tableLabel: 'a',
                    sql: '2 + ${m1}',
                    source: sourceMock,
                    isAutoGenerated: false,
                    hidden: false,
                },
            },
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const exploreWithMetricNumberCompiled: Explore = {
    ...exploreWithMetricNumber,
    joinedTables: [],
    tables: {
        a: {
            name: 'a',
            label: 'a',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            dimensions: {
                dim1: {
                    ...exploreWithMetricNumber.tables.a.dimensions.dim1,
                    compiledSql: '"a".dim1',
                    tablesReferences: ['a'],
                },
            },
            metrics: {
                m1: {
                    ...exploreWithMetricNumber.tables.a.metrics.m1,
                    compiledSql: 'SUM(("a".dim1))',
                    tablesReferences: ['a'],
                },
                m2: {
                    ...exploreWithMetricNumber.tables.a.metrics.m2,
                    compiledSql: '2 + (SUM(("a".dim1)))',
                    tablesReferences: ['a'],
                },
            },
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const tablesWithMetricsWithFilters: Record<string, Table> = {
    table1: {
        name: 'table1',
        label: 'table1',
        database: 'database',
        schema: 'schema',
        sqlTable: '"db"."schema"."table1"',
        dimensions: {
            dim1: {
                type: DimensionType.NUMBER,
                name: 'dim1',
                label: 'dim1',
                table: 'table1',
                tableLabel: 'table1',
                fieldType: FieldType.DIMENSION,
                sql: '${TABLE}.dim1',
                hidden: false,
            },
            shared: {
                type: DimensionType.STRING,
                name: 'shared',
                label: 'shared',
                table: 'table1',
                tableLabel: 'table1',
                fieldType: FieldType.DIMENSION,
                sql: '${TABLE}.shared',
                hidden: false,
            },
            with_reference: {
                type: DimensionType.NUMBER,
                name: 'with_reference',
                label: 'with_reference',
                table: 'table1',
                tableLabel: 'table1',
                fieldType: FieldType.DIMENSION,
                sql: '${TABLE}.dim1 + ${table2.dim2}',
                hidden: false,
            },
        },
        metrics: {
            metric1: {
                type: MetricType.MAX,
                fieldType: FieldType.METRIC,
                table: 'table1',
                tableLabel: 'table1',
                name: 'metric1',
                label: 'metric1',
                sql: '${TABLE}.number_column',
                isAutoGenerated: false,
                hidden: false,
                filters: [
                    {
                        id: 'filter1',
                        target: { fieldRef: 'shared' },
                        operator: FilterOperator.INCLUDE,
                        values: ['foo'],
                    },
                ],
            },
            metric_with_sql: {
                type: MetricType.MAX,
                fieldType: FieldType.METRIC,
                table: 'table1',
                tableLabel: 'table1',
                name: 'metric_with_sql',
                label: 'metric_with_sql',
                sql: 'CASE WHEN ${TABLE}.number_column THEN 1 ELSE 0 END',
                isAutoGenerated: false,
                hidden: false,
                filters: [
                    {
                        id: 'filter1',
                        target: { fieldRef: 'shared' },
                        operator: FilterOperator.INCLUDE,
                        values: ['foo'],
                    },
                ],
            },
        },
        lineageGraph: {},
        groupLabel: undefined,
    },
    table2: {
        name: 'table2',
        label: 'table2',
        database: 'database',
        schema: 'schema',
        sqlTable: '"db"."schema"."table2"',
        dimensions: {
            dim2: {
                type: DimensionType.NUMBER,
                name: 'dim2',
                label: 'dim2',
                table: 'table2',
                tableLabel: 'table2',
                fieldType: FieldType.DIMENSION,
                sql: '${TABLE}.dim2',
                hidden: false,
            },
            shared: {
                type: DimensionType.STRING,
                name: 'shared',
                label: 'shared',
                table: 'table2',
                tableLabel: 'table2',
                fieldType: FieldType.DIMENSION,
                sql: '${TABLE}.shared',
                hidden: false,
            },
        },
        metrics: {
            metric2: {
                type: MetricType.MAX,
                fieldType: FieldType.METRIC,
                table: 'table2',
                tableLabel: 'table2',
                name: 'metric2',
                label: 'metric2',
                sql: '${TABLE}.number_column',
                isAutoGenerated: false,
                hidden: false,
                filters: [
                    {
                        id: 'filter2_1',
                        target: { fieldRef: 'dim2' },
                        operator: FilterOperator.LESS_THAN,
                        values: [10],
                    },
                    {
                        id: 'filter2_2',
                        target: { fieldRef: 'dim2' },
                        operator: FilterOperator.GREATER_THAN,
                        values: [5],
                    },
                ],
            },
        },
        lineageGraph: {},
        groupLabel: undefined,
    },
};

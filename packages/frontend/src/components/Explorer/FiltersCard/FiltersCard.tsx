import { Tag } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import {
    countTotalFilterRules,
    Field,
    fieldId,
    FilterRule,
    getTotalFilterRules,
    getVisibleFields,
    isFilterableField,
} from '@lightdash/common';
import { FC, memo, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useExplore } from '../../../hooks/useExplore';
import { useProject } from '../../../hooks/useProject';
import {
    ExplorerSection,
    useExplorerContext,
} from '../../../providers/ExplorerProvider';
import CollapsableCard from '../../common/CollapsableCard';
import FiltersForm from '../../common/Filters';
import { getConditionalRuleLabel } from '../../common/Filters/configs';
import { FiltersProvider } from '../../common/Filters/FiltersProvider';
import { DisabledFilterHeader, FilterValues } from './FiltersCard.styles';
import { useFieldsWithSuggestions } from './useFieldsWithSuggestions';

const FiltersCard: FC = memo(() => {
    const { projectUuid } = useParams<{ projectUuid: string }>();
    const project = useProject(projectUuid);
    const expandedSections = useExplorerContext(
        (context) => context.state.expandedSections,
    );
    const isEditMode = useExplorerContext(
        (context) => context.state.isEditMode,
    );
    const tableName = useExplorerContext(
        (context) => context.state.unsavedChartVersion.tableName,
    );
    const filters = useExplorerContext(
        (context) => context.state.unsavedChartVersion.metricQuery.filters,
    );
    const additionalMetrics = useExplorerContext(
        (context) =>
            context.state.unsavedChartVersion.metricQuery.additionalMetrics,
    );
    const queryResults = useExplorerContext(
        (context) => context.queryResults.data,
    );
    const setFilters = useExplorerContext(
        (context) => context.actions.setFilters,
    );
    const toggleExpandedSection = useExplorerContext(
        (context) => context.actions.toggleExpandedSection,
    );
    const { data } = useExplore(tableName);
    const filterIsOpen = useMemo(
        () => expandedSections.includes(ExplorerSection.FILTERS),
        [expandedSections],
    );
    const totalActiveFilters: number = useMemo(
        () => countTotalFilterRules(filters),
        [filters],
    );
    const fieldsWithSuggestions = useFieldsWithSuggestions({
        exploreData: data,
        queryResults,
        additionalMetrics,
    });
    const allFilterRules = useMemo(
        () => getTotalFilterRules(filters),
        [filters],
    );
    const renderFilterRule = useCallback(
        (filterRule: FilterRule) => {
            const fields: Field[] = data ? getVisibleFields(data) : [];
            const field = fields.find(
                (f) => fieldId(f) === filterRule.target.fieldId,
            );
            if (field && isFilterableField(field)) {
                const filterRuleLabels = getConditionalRuleLabel(
                    filterRule,
                    field,
                );
                return (
                    <div key={field.name}>
                        {filterRuleLabels.field}: {filterRuleLabels.operator}{' '}
                        <FilterValues>{filterRuleLabels.value}</FilterValues>
                    </div>
                );
            }
            return `Tried to reference field with unknown id: ${filterRule.target.fieldId}`;
        },
        [data],
    );

    return (
        <CollapsableCard
            isOpen={filterIsOpen}
            title="Filters"
            disabled={!tableName || (totalActiveFilters === 0 && !isEditMode)}
            toggleTooltip={
                totalActiveFilters === 0 && !isEditMode
                    ? 'This chart has no filters'
                    : ''
            }
            onToggle={() => toggleExpandedSection(ExplorerSection.FILTERS)}
            headerElement={
                <>
                    {totalActiveFilters > 0 && !filterIsOpen ? (
                        <Tooltip2
                            content={
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                    }}
                                >
                                    {allFilterRules.map(renderFilterRule)}
                                </div>
                            }
                            interactionKind="hover"
                            placement={'bottom-start'}
                        >
                            <Tag round minimal>
                                {totalActiveFilters} active filter
                                {totalActiveFilters === 1 ? '' : 's'}
                            </Tag>
                        </Tooltip2>
                    ) : null}
                    {totalActiveFilters > 0 && filterIsOpen && !isEditMode ? (
                        <DisabledFilterHeader>
                            You must be in 'edit' or 'explore' mode to change
                            the filters
                        </DisabledFilterHeader>
                    ) : null}
                </>
            }
        >
            <FiltersProvider
                projectUuid={projectUuid}
                fieldsMap={fieldsWithSuggestions}
                startOfWeek={project.data?.warehouseConnection?.startOfWeek}
            >
                <FiltersForm
                    isEditMode={isEditMode}
                    filters={filters}
                    setFilters={setFilters}
                />
            </FiltersProvider>
        </CollapsableCard>
    );
});

export default FiltersCard;

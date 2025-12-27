import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export const useFilter = (initialFilters = {}, onFilterChange = null) => {
    const [filters, setFilters] = useState(initialFilters);
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Update a single filter
    const updateFilter = useCallback((key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            // Call callback if provided
            if (onFilterChange) {
                onFilterChange(newFilters);
            }

            return newFilters;
        });
    }, [onFilterChange]);

    // Update multiple filters at once
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => {
            const updated = { ...prev, ...newFilters };

            if (onFilterChange) {
                onFilterChange(updated);
            }

            return updated;
        });
    }, [onFilterChange]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
        setSearchTerm('');

        if (onFilterChange) {
            onFilterChange(initialFilters);
        }
    }, [initialFilters, onFilterChange]);

    // Clear a single filter
    const clearFilter = useCallback((key) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];

            if (onFilterChange) {
                onFilterChange(newFilters);
            }

            return newFilters;
        });
    }, [onFilterChange]);

    // Count active filters (excluding null/undefined/empty values)
    const activeFiltersCount = useMemo(() => {
        return Object.values(filters).filter(value =>
            value !== null &&
            value !== undefined &&
            value !== '' &&
            (Array.isArray(value) ? value.length > 0 : true)
        ).length;
    }, [filters]);

    // Check if filters are active
    const hasActiveFilters = activeFiltersCount > 0 || debouncedSearchTerm.length > 0;

    // Get filter query params for API calls
    const getFilterParams = useCallback(() => {
        const params = { ...filters };

        if (debouncedSearchTerm) {
            params.search = debouncedSearchTerm;
        }

        // Remove null/undefined values
        Object.keys(params).forEach(key => {
            if (params[key] === null || params[key] === undefined || params[key] === '') {
                delete params[key];
            }
        });

        return params;
    }, [filters, debouncedSearchTerm]);

    // Reset to initial state
    const reset = useCallback(() => {
        setFilters(initialFilters);
        setSearchTerm('');
    }, [initialFilters]);

    return {
        // State
        filters,
        searchTerm,
        debouncedSearchTerm,
        activeFiltersCount,
        hasActiveFilters,

        // Methods
        setSearchTerm,
        updateFilter,
        updateFilters,
        clearFilters,
        clearFilter,
        getFilterParams,
        reset
    };
};

/**
 * Predefined filter configurations for common entities
 */
export const filterConfigs = {
    equipment: {
        departmentId: null,
        categoryId: null,
        status: null,
        maintenanceTeamId: null
    },

    requests: {
        stage: null,
        priority: null,
        teamId: null,
        assignedToUserId: null,
        equipmentId: null,
        requestType: null
    },

    users: {
        role: null,
        department: null,
        status: 'active'
    },

    calendar: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        teamId: null
    }
};

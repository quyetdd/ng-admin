/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope}        $scope
     * @param {$state}        $state
     * @param {$stateParams}  $stateParams
     * @param {$filter}       $filter
     * @param {Configuration} Configuration
     *
     * @constructor
     */
    function maFilterViewController($scope, $state, $stateParams, $filter) {
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$filter = $filter;
        this.values = this.$stateParams.search || {};
        this.$scope.filters = this.$scope.filters();
        this.isFilterEmpty = isEmpty(this.values);
    }

    function isEmpty(values) {
        for (i in values) {
            if (values[i] != '') return false;
        }
        return true;
    }

    maFilterViewController.prototype.filter = function () {
        var values = {},
            filters = this.$scope.filters,
            fieldName,
            field,
            i;

        for (i in filters) {
            field = filters[i];
            fieldName = field.name();

            if (this.values[fieldName]) {
                values[fieldName] = this.values[fieldName];

                if (field.type() === 'date') {
                    values[fieldName] = this.$filter('date')(values[fieldName], field.format());
                }
            }
        }

        this.$stateParams.search = values;
        this.$state.go(this.$state.current, this.$stateParams, { reload: true, inherit: false, notify: true });
    };

    maFilterViewController.prototype.shouldFilter = function () {
        return Object.keys(this.$scope.filters).length;
    };

    maFilterViewController.prototype.clearFilters = function () {
        var i;

        for (i in this.values) {
            this.values[i] = null;
        }

        this.filter();
    };

    maFilterViewController.$inject = ['$scope', '$state', '$stateParams', '$filter'];

    return maFilterViewController;
});

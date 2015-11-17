/* 
 * Angular JS Stateful DOM
 * Embed a model on DOM which can be modified by most hardware input events
 *
 * Project started on: Fri, 21 Aug 2015 - 3:40:37 PM 
 * Current version: 0.1.0
 * 
 * Released under the MIT License
 * --------------------------------------------------------------------------------
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Ignatius Steven (https://github.com/isteven)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions: 
 *
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 * --------------------------------------------------------------------------------
 */

'use strict'
angular.module( 'isteven-stateful-dom', [ 'ng' ] ).directive( 'istevenStatefulDom' , [ '$timeout', '$templateCache', function ( $timeout, $templateCache ) {

    return {

        restrict: 
            'AE',

        scope: 
        {   
            selectedState   : '=',
            availableStates : '=',
            trackBy         : '@',
            onChange        : '&'
        },
                                                         
        link: function ( $scope, element, attrs ) {               

            $scope.cycleValue = function( indexVector ) {

                if ( typeof indexVector === 'undefined' || indexVector === null || indexVector === '' ) {
                    indexVector = 'increase';
                }

                var selectIdx = 0;                                

                if ( typeof $scope.selectedState === 'undefined' ) {
                    selectIdx = -1;
                }

                else {
                    var selectIdx = $scope.availableStates.indexOf( $scope.selectedState );
                }

                if ( indexVector === 'increase' ) {
                    selectIdx = selectIdx + 1;
                    if ( selectIdx > $scope.availableStates.length - 1 ) {
                        selectIdx = 0;
                    }
                }
                else {
                    selectIdx = selectIdx - 1;
                    if ( selectIdx < 0 ) {
                        selectIdx = $scope.availableStates.length - 1;
                    }
                }

                $scope.$apply( function() {
                    $scope.selectedState = $scope.availableStates[ selectIdx ];                    
                });

                if ( $scope.onClick ) {
                    $timeout( function() {
                        $scope.onClick();
                    },0);
                }
            }

            $scope.clickCycle = function( e ) {                
                
                $scope.cycleValue();
                
            }

            $scope.mouseWheelCycle = function( e ) {

            	var e = window.event || e; 

                e.preventDefault();
                e.stopPropagation();                      

	            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
               
                // scroll up
                if ( delta == 1 ) {
                    $scope.cycleValue( 'increase' );
                }
                // scroll down
                else {
                    $scope.cycleValue( 'decrease' );
                }
            }            

            // bind on click and mousewheel
            angular.element( element[ 0 ] ).on( 'click',            $scope.clickCycle );            
            angular.element( element[ 0 ] ).on( 'wheel',            $scope.mouseWheelCycle );                        
            angular.element( element[ 0 ] ).on( 'DOMMouseScroll',   $scope.mouseWheelCycle );            
            // bind on keyboard keys
            angular.element( element[ 0 ] ).on( 'keyUp',            $scope.keyUp );            

            
            // unbind events to prevent memory leaks
            $scope.$on( '$destroy', function () {
			    angular.element( element[ 0 ] ).unbind( 'click',            $scope.clickCycle );
            	angular.element( element[ 0 ] ).unbind( 'wheel',            $scope.mouseWheelCycle );
                angular.element( element[ 0 ] ).unbind( 'DOMMouseScroll',   $scope.mouseWheelCycle );
            });

        }
            
    }
}]);


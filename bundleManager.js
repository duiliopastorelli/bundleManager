'use strict';

/**
 * Bundle Manager
 * @author: Danilo Mezgec
 *
 * This script helps to maintain the proper order between the js bundles loaded
 * with the async flag.
 */

let bundleManager = {};

/**
 * "manage" method.
 *
 * As it is possible that a function is called before the bundleName is loaded
 * (mainly because of the async flag), this function manages the whole script
 * with a callback, after checking that the bundleName is loaded into the stack.
 *
 * Parameters:
 * - dependencyName ([String]) - indicates the name of the dependency that the
 * current bundle requires for work properly. For i.e. if the bundle is the
 * owlCarousel plugin, then the dependencyName will be 'jQuery'.
 *
 * - bundleName ([String)] - indicates the name of the current bundle. It is
 * used for the event emitter and as a dependencyName for bundles that require
 * the current bundle.
 *
 * - cb (function) - callback function that will be executed after the
 * dependency tree will be satisfied. Replace it with function(){...code...}
 *
 * i.e.: bundleManager.isReady('owlCarousel', function(){...code...});
 *
 * @param dependencyName
 * @param bundleName
 * @param cb
 */
bundleManager.manage = function
    ( dependencyName, bundleName, cb ) {

    let
        optionalDependency =
            ( typeof dependencyName === 'string' ) ? dependencyName : null,
        optionalBundleName,
        avoidRegistration = false;

    if( typeof bundleName === 'string' ){

        // A bundle name is passed, set the new event emitter
        optionalBundleName = bundleName;

    } else {

        // A bundle name is not passed, avoid to set the new event emitter
        optionalBundleName = null;
        avoidRegistration = true;

    }

    // Has dependency domain
    if( optionalDependency !== null ){

        // Check if the dependency is not already loaded in the stack
        if( bundleManager[optionalDependency] !== true ){

            // The dependency is not ready, set an event listener for it and
            // fire the callback when the dependency will be available
            document.addEventListener(
                optionalDependency + 'IsReady', function() {

                    cb();
                    setNewEvent( optionalBundleName, avoidRegistration );

                });

        } else {

            cb();

            setNewEvent( optionalBundleName, avoidRegistration );

        }

        // Has not dependency domain
    } else {

        cb();
        setNewEvent( optionalBundleName, avoidRegistration );
    }
};

/**
 * Function for register the new bundle if not decided otherwise
 *
 * Parameters:
 * - bundleName (String) - the name of the bundle
 * - avoidRegistration (bool) - flag that allows to avoid to register a new event
 *
 * @param bundleName
 * @param avoidRegistration
 */
let setNewEvent = function( bundleName, avoidRegistration ){

    if(

        avoidRegistration === false &&
        bundleName !== null

    ){

        let isReady = new Event( bundleName + 'IsReady' );
        document.dispatchEvent( isReady );
        bundleManager[bundleName] = true;

    }
};
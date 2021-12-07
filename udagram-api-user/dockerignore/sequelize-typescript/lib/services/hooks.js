"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var HOOKS_KEY = 'sequelize:hooks';
/**
 * Installs hooks on the specified models
 */
function installHooks(models) {
    models.forEach(function (model) {
        var hooks = getHooks(model);
        if (hooks) {
            hooks.forEach(function (hook) {
                installHook(model, hook);
            });
        }
    });
}
exports.installHooks = installHooks;
/**
 * Implementation for hook decorator functions. These are polymorphic. When
 * called with a single argument (IHookOptions) they return a decorator
 * factory function. When called with multiple arguments, they add the hook
 * to the model’s metadata.
 */
function implementHookDecorator(hookType, args) {
    if (args.length === 1) {
        var options_1 = args[0];
        return function (target, propertyName) {
            return addHook(target, hookType, propertyName, options_1);
        };
    }
    else {
        var target = args[0];
        var propertyName = args[1];
        addHook(target, hookType, propertyName);
    }
}
exports.implementHookDecorator = implementHookDecorator;
/**
 * Adds hook meta data for specified model
 * @throws if applied to a non-static method
 * @throws if the hook method name is reserved
 */
function addHook(target, hookType, methodName, options) {
    if (options === void 0) { options = {}; }
    if (typeof target !== 'function') {
        throw new Error("Hook method '" + methodName + "' is not a static method. " +
            "Only static methods can be used for hooks");
    }
    // make sure the hook name doesn’t conflict with Sequelize’s existing methods
    if (methodName === hookType) {
        throw new Error("Hook method cannot be named '" + methodName + "'. That name is " +
            "reserved by Sequelize");
    }
    var hooks = getHooks(target) || [];
    hooks.push({
        hookType: hookType,
        methodName: methodName,
        options: options
    });
    setHooks(target, hooks);
}
exports.addHook = addHook;
/**
 * Install a hook
 */
function installHook(model, hook) {
    if (hook.options && hook.options.name) {
        model.addHook(hook.hookType, hook.options.name, model[hook.methodName]);
        return;
    }
    model.addHook(hook.hookType, model[hook.methodName]);
}
/**
 * Returns hooks meta data from specified class
 */
function getHooks(target) {
    var hooks = Reflect.getMetadata(HOOKS_KEY, target);
    if (hooks) {
        return hooks.slice();
    }
}
exports.getHooks = getHooks;
/**
 * Saves hooks meta data for the specified class
 */
function setHooks(target, hooks) {
    Reflect.defineMetadata(HOOKS_KEY, hooks, target);
}
exports.setHooks = setHooks;
//# sourceMappingURL=hooks.js.map
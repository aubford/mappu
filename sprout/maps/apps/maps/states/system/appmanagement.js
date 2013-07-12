/**
 *  Mappu : yet another web gis (with social taste).
 *  Copyright (c) 2011 Umberto Nicoletti - umberto.nicoletti _at_ gmail.com, all rights reserved.
 *
 *  Licensed under the LGPL.
 */

Maps.appManagementState = SC.State.extend({
    initialSubstate:'viewingManagerPane',

    enterState:function () {
        if (!SC.browser.isIE) {
            // prepare animation
            Maps.appManagementPane.adjust("opacity", 0);
            // append
            Maps.appManagementPane.append();
            // perform animation
            Maps.appManagementPane.animate({opacity:1}, 0.5);
        } else {
            Maps.appManagementPane.append();
        }
    },

    exit: function() {
        this.gotoState("browsingMapState");
    },

    exitState:function () {
        Maps.appManagementPane.remove();
    },

    viewingManagerPane: SC.State.extend({
        enterState: function() {
            // start loading data
            Maps.systemUsersController.load();
        },

        createUser: function() {
            this.gotoState("creatingUser")
        }
    }),

    creatingUser :SC.State.extend({
        nestedStore: null,

        enterState: function() {
            this.nestedStore = Maps.store.chain();
            Maps.systemUserController.set("content",this.nestedStore.createRecord(Maps.SysUser, {enabled: true}));
            Maps.systemUserController.set("isCreating", YES);
        },

        save: function() {
            this.nestedStore.commitChanges(NO);
            this.gotoState("appManagementState");
        },

        cancel: function() {
            this.nestedStore.discardChanges();
            this.gotoState("appManagementState");
        },

        exitState: function() {
            this.nestedStore.destroy();
            this.nestedStore=null;
            Maps.systemUserController.set("isCreating", NO);
        }
    })
});
/**
  *  Mappu : yet another web gis (with social taste).
  *  Copyright (c) 2011 Umberto Nicoletti - umberto.nicoletti _at_ gmail.com, all rights reserved.
  *
  *  Licensed under the LGPL.
*/

Maps.User=SC.Record.extend({
    username: SC.Record.attr(String),
    authenticated: SC.Record.attr(Boolean)
});
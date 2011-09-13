
Maps.featureInfoAttributesController = SC.ArrayController.create(SCTable.TableDelegate,{

    whenSelectionChanges: function() {
        if(Maps.featureInfoController.selection().firstObject()) {
            var guid = Maps.featureInfoController.selection().firstObject().get('guid');
            Maps.ATTRIBUTES_QUERY.parameters.id=guid;
            this.content.refresh();
        }
    }.observes("Maps.featureInfoController.selection"),

    onAttributeDoubleClick: function() {
        var attr = this.get("selection").firstObject();
        var feature = Maps.featureInfoController.get("selection").firstObject();

        var layer=Maps.openLayersController.get("content").filterProperty('name',feature.get("GROUP")+":"+feature.get("LAYER"))[0];
        if(layer.get("cql_filter")!=null) {
            layer.set("cql_filter",null);
        } else {
            layer.set("cql_filter",attr.get("property")+"='"+attr.get("value")+"'");
        }
    }

});
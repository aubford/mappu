// ==========================================================================
// Project:   Maps.socialCommentsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Maps */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Maps.socialCommentsController = SC.ArrayController.create(
	SC.CollectionViewDelegate,
/** @scope Maps.socialCommentsController.prototype */ {

    newCommentText: "",

	collectionViewDeleteContent: function(view, content, indexes) {
		// destroy the records
		var records = indexes.map(function(idx) {return this.objectAt(idx);}, this);
		records.invoke('destroy');
		
		this.deselectObjects(this.get('selection'));
		
		this.invokeLater(function(){this.get("content").refresh()});
    },

	addComment: function() {
        if(this.get("newCommentText")=="") {
            this.content.refresh();
        } else {
            var guid = Maps.featureInfoController.get("selection").firstObject().getSocialID();

            if (guid!=null && guid!=undefined) {
                console.log("Adding comment to guid: "+guid);
                var comment = Maps.featuresStore.createRecord(Maps.Comment, {"social": guid, "text" : this.get("newCommentText")} );

                this.content.add(comment);

                this.invokeLater(function(){
                    this.content.refresh();
                    Maps.mainPage.commentsTab.comments.scrollDownPage();
                });

                this.set("newCommentText","");
            }
        }
	  }
});

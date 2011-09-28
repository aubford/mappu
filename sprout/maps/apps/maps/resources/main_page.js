// ==========================================================================
// Project:   Maps - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Maps */

SC.Binding.labelPrefix = function(prefix) {
  return this.transform(function(value, binding) {
    return prefix + " " + (value ? value : "n/a");
  }) ;
};

var app_logo_huge=static_url('images/app-logo-huge.png');

// This page describes the main user interface for your application.  
Maps.mainPage = SC.Page.design({

    // The main pane is made visible on screen as soon as your app is loaded.
    // Add childViews to this pane for views to display immediately on page
    // load.
    mainPane: SC.MainPane.design({
        childViews: 'toolbar splitview'.w(),

        defaultResponder: 'Maps.MainResponder',

        toolbar : SC.ToolbarView.design({
            layout: { top: 0, left: 0, right: 0, height: 44 },
            anchorLocation: SC.ANCHOR_TOP,
            childViews : 'logo layers tools label'.w(),

            logo: SC.LabelView.design({
                layout: {centerY:0, left:20, height:24, width: 500},
                value: "Comune di Mirano",
                classNames: "app-logo".w()
            }),
            layers : SC.SegmentedView.design({
                layout: { centerY: 0, height: 30, right: 630, width: 160 },
                controlSize: SC.LARGE_CONTROL_SIZE,
                items : [
                    {title: 'Layers', action: 'LAYERS'},
                    {title: 'Search', action: 'SEARCH'}
                ],
                itemTitleKey : 'title',
                itemValueKey : 'action',
                valueBinding: "Maps.openLayersController.layersAndSearch",
                allowsEmptySelection: YES,
                allowsMultipleSelection: YES
            }),
            tools : SC.SegmentedView.design({
                layout: { centerY: 0, height: 30, right: 370, width: 270 },
                controlSize: SC.LARGE_CONTROL_SIZE,
                items : [
                    {title: 'Move', action: 'toolMove'},
                    {title: 'Area', action: 'toolArea'},
                    {title: 'Length', action: 'toolLength'},
                    {title: 'Geo Tools', action: 'toolGeo'}
                ],
                itemTitleKey : 'title',
                itemValueKey : 'action',
                valueBinding: "Maps.openLayersController.tools"
            }),
            label : SC.LabelView.design({
                classNames: ['maps_black'],
                controlSize: SC.LARGE_CONTROL_SIZE,
                layout: { centerY: 0, height: 25, right: 160, width: 190 },
                escapeHTML: NO,
                valueBinding: "Maps.openLayersController.measure"
            })
        }),

        splitview : SC.SplitView.design({
            layout: { top: 45, left: 0, bottom:0, right: 0 },
            layoutDirection: SC.LAYOUT_HORIZONTAL,
            childViews: 'topLeftView bottomRightView'.w(),

            topLeftView: Maps.OpenLayers.design(SC.SplitChild,{
                layout: { top: 37, left: 0, bottom:0, right: 224 },

                layerId: 'olmap',

                contentBinding: "Maps.openLayersController.content",
                exampleView: Maps.OpenLayersLayer
            }),

            bottomRightView: SC.View.design(SC.SplitChild,{
                size: 200,
                layout: { top: 37, width: 223, bottom:0, right: 0 },

                childViews: "resultsView featureView".w(),
                resultsView: SC.ScrollView.design({
                    layout: { top: 0, left: 0, height:250, right: -1 },
                    hasHorizontalScroller: NO,
                    backgroundColor: 'white',
                    contentView: SC.ListView.design({
                        classNames: ["maps-chkbox-starred"],
                        rowHeight: 24,
                        contentBinding: 'Maps.featureInfoController.arrangedObjects',
                        selectionBinding: 'Maps.featureInfoController.selection',
                        contentValueKey: "name",
                        contentCheckboxKey: "isStarred",
                        action: "dblclick"
                    })
                }),

                featureView: SCTable.TableView.design({
                    layout: { top: 251, bottom: -1, left:0, right: -1 },

                    contentBinding: 'Maps.featureInfoAttributesController.arrangedObjects',
                    selectionBinding: 'Maps.featureInfoAttributesController.selection',

                    action: "onAttributeDoubleClick",
                    target: "Maps.featureInfoAttributesController",

                    columns: [SC.Object.create(SCTable.Column, {
                        name: "Property",
                        valueKey: 'property',
                        width: 100,
                        canSort: YES
                        }),
                        SC.Object.create(SCTable.Column, {
                            name: "Value",
                            valueKey: 'value',
                            width: 170,
                            canSort: YES
                        })]
                })
            })
        })
    }),
    tagsTab: SC.View.design({
        childViews: "star tags saveTags".w(),
        star: SC.LabelView.design({
            layout: {left: 10, top:10, width: 350, height: 30 },
            valueBinding: 'Maps.socialController.starredAsText'
        }),
        tags: SC.TextFieldView.design({
            isTextArea: YES,
            layout: {left: 10, top: 35, right: 10, height: 60 },
            valueBinding: 'Maps.socialController.tags'
        }),
        saveTags: SC.ButtonView.design({
            layout: {top: 110, right: 10, width: 50},
            title: "Save",
            action: "saveTags",
            titleMinWidth: 40
        })
    }),

    commentsTab: SC.View.design({
        childViews: "comments newComment addComment delComment".w(),
        comments: SC.ScrollView.design({
            layout: {left: 10, top:15, right: 10, bottom: 50 },
            backgroundColor: 'white',
            contentView: SC.ListView.design({
                themeName: "comments",
                rowHeight: 75,
                showAlternatingRows: YES,
                isSelectable: YES,
                contentBinding: 'Maps.socialCommentsController.arrangedObjects',
                selectionBinding: 'Maps.socialCommentsController.selection',
                contentValueKey: "readable"
                //exampleView: Maps.CommentView,
                //canEditContent: YES,
                //canDeleteContent: YES
            })
        }),
        newComment: SC.TextFieldView.design({
            layout: {bottom: 10, left:10, width: 295, height: 25 },
            valueBinding: "Maps.socialCommentsController.newCommentText",
            hint: "Aggiungi un commento..."
        }),
        addComment: SC.ButtonView.design({
            layout: {bottom: 10, right:55, width: 25, height: 25},
            title: "+",
            action: "addComment",
            isEnabledBinding: SC.Binding.bool().from("Maps.socialCommentsController.newCommentText")
        }),
        delComment: SC.ButtonView.design({
            layout: {bottom: 10, right:10, width: 25, height: 25},
            title: "-",
            action: "delComment",
            isEnabledBinding: SC.Binding.transform(function(value, binding) {
                return (value && value.length()>0) ? true : false;
              }).from("Maps.socialCommentsController.selection")
        })
    }),

    nosocialTab: SC.View.design({
        childViews: "icon explanation".w(),
        icon: SC.ImageView.design({
            layout: {centerY:0, left: 10, width:24, height:24},
            value: "sc-icon-alert-24"
        }),
        explanation: SC.LabelView.design({
            layout: {centerY:0, left: 54, right:10, height: 80},
            value: "La feature che hai selezionato non ha un attributo ID, quindi non e' possibile associarvi alcuna informazione. E' possibile chiedere al gestore del sito di aggiungere un attributo ID al livello corrente."
        })
    }),

    linksTab: SC.View.design({
        childViews: "links description".w(),
        links: SC.ScrollView.design({
            layout: {left: 10, top:15, right: 10, bottom: 50 },
            backgroundColor: 'white',
            contentView: SC.ListView.design({
                rowHeight: 45,
                showAlternatingRows: YES,
                isSelectable: NO,
                contentBinding: 'Maps.linkController.arrangedObjects',
                selectionBinding: 'Maps.linkController.selection',
                contentValueKey: "title",
                exampleView: Maps.LinkView
            })
        }),
        description: SC.LabelView.design({
            title: "Links",
            layout: {bottom: 10, right:10, width: 130, height: 30 }
        })
    }),

    queryListPane: SC.View.design({
        layout: {top:10, bottom:10, right:10, left:10},
        childViews: "label queryList".w(),
        label:SC.LabelView.design({
            layout: {top:5, left:5, right:5},
            value: "Double click to choose one of the available queries"
        }),
        queryList: SC.ScrollView.design({
            layout: {bottom:5, top:36, left:5, right:5},
            backgroundColor: 'white',
            contentView: SC.ListView.design({
                rowHeight:24,
                contentBinding: 'Maps.layerQueryController.arrangedObjects',
                selectionBinding: 'Maps.layerQueryController.selection',
                contentValueKey: "description",
                action:"goToEditQuery"
            })
        })
    }),

    queryEditPane: SC.View.design({
        childViews: "title form send back".w(),
        title: SC.LabelView.design({
            layout: {top:5, left:5, right:5},
            valueBinding: SC.Binding.from("Maps.layerQueryController.selection").transform(function(value, isForward) {
                if (isForward) {
                    return value.firstObject().get("description")
                }
            })
        }),
        form: Maps.FormView.design({
            layout: {top: 36, left:5, right:5, height: 72},
            // does not seem to work ???
            valueBinding: SC.Binding.from("Maps.layerQueryController.selection").transform(function(value, isForward) {
                if (isForward) {
                    return value.firstObject().get("filterString")
                }
            })
        }),
        back: SC.ButtonView.design({
            layout: {right:100, bottom: 10, width: 80, height: 25},
            title: "Back",
            action: "layerQueryBack",
            themeName: "point-left"
        }),
        send: SC.ButtonView.design({
            layout: {right:10, bottom: 10, width: 80, height: 25},
            title: "Run",
            action: "layerQueryRun"
        })
    }),

    layerSearchPane : SC.PickerPane.design({
        layout: { height: 200, width: 400},
        contentView: SC.SceneView.design({
            layout: {top:0,bottom:0,left:0,right:0},
            scenes: ["Maps.mainPage.queryListPane", "Maps.mainPage.queryEditPane"],
            nowShowingBinding: "Maps.openLayersController.layerSearchNowShowing"
        })
    }).create(),

    layerPalette : SC.PickerPane.extend({
        layout: { width: 500, height: 300 },
        contentView: SC.View.extend({
            layout: {top: 0, left: 0, right: 0, bottom: 0},
            childViews: 'googleView layerView layerDetailView'.w(),
            googleView: SC.RadioView.design({
                layout: {top: 10, left: 5, right: 5, height: 30},
                items: 'Streets Satellite'.w(),
                valueBinding: "Maps.openLayersController.whichGoogleLayer",
                height: 24,
                layoutDirection: SC.LAYOUT_HORIZONTAL
            }),
            layerView: SC.ScrollView.design({
                hasHorizontalScroller: NO,
                layout: { top: 40, bottom: 5, left: 5, width: 200 },
                backgroundColor: 'white',
                contentView: SC.ListView.design({
                    rowHeight: 24,
                    contentBinding: 'Maps.openLayersController.arrangedObjects',
                    selectionBinding: 'Maps.openLayersController.selection',
                    contentValueKey: "name",
                    contentCheckboxKey: "visible",
                    contentIconKey: "legendIcon",
                    contentRightIconKey: "filterIcon",
                    hasContentIcon: YES,
                    hasContentRightIcon: YES,
                    action:"layerSearch",
                    canReorderContent: YES,
                    isEditable: YES,
                    action: "onLayerSelected",
                    target: "Maps.openLayersController",
                    actOnSelect: YES
                })
            }),
            layerDetailView: SC.View.design({
                layout: { top: 40, bottom: 5, right: 10, width: 270 },
                isVisibleBinding: SC.Binding.bool().from("Maps.layerController.content"),
                childViews: "title name description opacitylbl opacity toggleFilter".w(),
                title: SC.LabelView.design({
                    value: "Informazioni",
                    controlSize: SC.LARGE_CONTROL_SIZE,
                    layout: {top: 0, right:5, height: 20, left:5}
                }),
                name: SC.LabelView.design({
                    valueBinding: SC.Binding.from('Maps.layerController.name').labelPrefix("Nome:"),
                    layout: {top: 25, right:5, height: 20, left:5}
                }),
                opacitylbl: SC.LabelView.design({
                    layout: {top: 50, right:5, height: 20, left:5},
                    value: "Trasparenza:"
                }),
                opacity:SC.SliderView.design({
                    layout: {top: 70, right:10, height: 20, left:10},
                    valueBinding: 'Maps.layerController.opacity',
                    maximum: 10,
                    minimum: 0,
                    step: 1
                }),
                description: SC.LabelView.design({
                    valueBinding: SC.Binding.from('Maps.layerController.description').labelPrefix("Descrizione:"),
                    layout: {top: 110, right:5, bottom: 50, left:5}
                }),
                toggleFilter: SC.ButtonView.design({
                    layout: {bottom: 10, left:5, height: 25, right:5},
                    titleBinding: SC.Binding.labelPrefix("Rimuovi filtro").from("Maps.layerController.cql_filter"),
                    action: "doRemoveFilter",
                    isEnabledBinding: SC.Binding.bool().from("Maps.layerController.cql_filter")
                })
            })
        })
    }).create(),

    geotools : SC.PalettePane.create({
        layout: { width: 144, height: 159, left: 200, top: 100 },
        contentView: SC.View.extend({
            layout:{top:0,bottom:0,left:0,right:0},
            childViews: "feature1 feature2 operation go".w(),
            feature1: Maps.DropView.design({
                layout: {top: 5, left:5, right:5, height:36},
                valueBinding: "Maps.featureInfoController.feature1descr",
                textAlign: SC.ALIGN_CENTER,
                classNames: ["maps-dropview"],
                dropTargetProperty: "feature1"
            }),
            feature2: Maps.DropView.design({
                layout: {top: 46, left:5, right:5, height:36},
                valueBinding: "Maps.featureInfoController.feature2descr",
                textAlign: SC.ALIGN_CENTER,
                classNames: ["maps-dropview"],
                dropTargetProperty: "feature2"
            }),
            operation: SC.SelectView.design({
                layout: {top: 97, left:5, right:5, height:36},
                items: [
                    { title: "Intersection", pos: 1},
                    { title: "Union", pos: 2 },
                    { title: "Buffer", pos: 3 }
                ],
                itemTitleKey: 'title',
                itemValueKey: 'title',
                itemSortKey: 'pos',
                checkboxEnabled: YES,
                valueBinding: "Maps.featureInfoController.operation"
            }),
            go: SC.SegmentedView.design({
                layout: {top: 128, left:5, right:5, height:36},
                items: [
                    {title: "OK", action:"performGeoOperation"},
                    {title: "Clear", action:"performGeoClear"},
                    {title: "Close", action:"performGeoClose"}
                ],
                itemTitleKey: "title",
                itemActionKey: "action"
            })
        })
    })

});

Maps.loginPage = SC.Page.design({
    mainPane: SC.MainPane.design({
        themeName: "loginPane",
        layout:{top:0,bottom:0,left:0,right:0},
        childViews: "logo loginform".w(),
        logo: SC.ImageView.design({
            layout:{centerY:0, left:80, width: 373, height: 96},
            value:app_logo_huge,
            canLoadInBackground: YES
        }),
        loginform:SC.View.design({
            layout: {width: 500, height: 300, left: 600, centerY: 0},
            classNames:"loginform".w(),

            childViews: 'labelU login labelP password button message'.w(),
            labelU: SC.LabelView.design({
                layout: {top:45, width:200, left:15, height:50},
                value: "Username: ",
                classNames:"formlabel".w(),
                controlSize: SC.HUGE_CONTROL_SIZE
            }),
            login: SC.TextFieldView.design({
                layout: {top:45, right:25, left:155, height:50},
                valueBinding: "Maps.authenticationManager.inputUsername",
                controlSize: SC.HUGE_CONTROL_SIZE
            }),
            labelP: SC.LabelView.design({
                layout: {top:105, width:200, left:15, height:50},
                value: "Password: ",
                classNames:"formlabel".w(),
                controlSize: SC.HUGE_CONTROL_SIZE
            }),
            password: SC.TextFieldView.design({
                layout: {top:105, right:25, left:155, height:50},
                valueBinding: "Maps.authenticationManager.inputPassword",
                isPassword: YES,
                controlSize: SC.HUGE_CONTROL_SIZE
            }),
            message: SC.LabelView.design({
                layout: {top:165, right:25, left:15, height:50},
                valueBinding: "Maps.authenticationManager.message",
                isVisibleBinding: "Maps.authenticationManager.message",
                classNames:"loginmessage".w(),
                controlSize: SC.HUGE_CONTROL_SIZE
            }),
            button: SC.ButtonView.design({
                layout: {top:220, right:35, width:55, height:30},
                title:"Login",
                controlSize:SC.HUGE_CONTROL_SIZE,
                themeName: 'round',
                action: "submitLogin",
                target: "Maps.authenticationManager",
                isEnabledBinding: "Maps.authenticationManager.inputUsername"
            })
        })
    })
});

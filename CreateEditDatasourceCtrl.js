app.controller('CreateEditDatasourceCtrl', function($scope, MasterAttributesService, $mdDialog, DatasetService, $rootScope, $window, DataSourceService, localStoreService, $location, CalculationServices, BlocklyTransferService, LogicRefServices, $timeout) {
    $scope.pages = [
        { name: 20, value: 20 },
        { name: 50, value: 50 },
        { name: 100, value: 100 }
    ];
    $scope.elementTypeList = [
        { key: "Text", value: "Text" },
        { key: "Care", value: "Care" },
        { key: "Date", value: "Date" },
        { key: "Fiber", value: "Fiber" },
        { key: "Image List", value: "Image List" },
        { key: "List Box", value: "List Box" },
        { key: "Look Up", value: "Lookup" },
        { key: "Calculation", value: "Calculation" },
        { key: "Numeric", value: "Numeric" }

    ];
    $scope.caseList = [
        { key: "UnChanged", value: "N" },
        { key: "LowerCase", value: "L" },
        { key: "Sentence", value: "S" },
        { key: "ProperCase", value: "P" },
        { key: "Upper Case", value: "U" }
    ];
    $scope.isedit = false;
    $scope.disablePromote = true;
    var flagCreate = false;
    $rootScope.EditDataView = undefined;
    var SaveViewUpdateDeleteGlobal = "";
    var SaveDatasourceGlobal = "";
    var saveDataSourceGlobalCounter = 0;
    var SaveDatasourceDescription = "";
    var UpdateResponse = "";
    var ViewFlag = false;
    var SaveFlag = false;
    var ViewSaveCounter = 0;
    var VersionGlobal = "";
    var viewDataSourceGlobal = "";
    var DeleteDataResponse = "";
    var CreateDataResponse = "";
    var cnt = $scope;
    $scope.datasourceExist = false;
    $scope.removeHover="";
    $scope.elementHeaderNameList = ["Field Id", "Element Name", "Element Type", "Properties", "Prompt", "Required",
        "Case", "Mask", "Min Length", "Max Length", "Barcode Properties", "Rule"
    ];
    $scope.minMaxErrorMessage = "Value greater than the Max char Length";
    $scope.pageSize = $scope.pages[0].value;
    var details = localStoreService.get('glidinfo');
    $scope.glidnumber = details.glidNumberPermanent;
    var rbcId = localStoreService.get("customerIdFromFM");
    $scope.currentPage = 1;
    // $scope.RBCCode = '10090908093700601';
    // $scope.rbcCode = 'MOCA';
    $scope.RBCCode = rbcId;
    $scope.rbcCode = details.rboCode;
    $scope.datasetDetail = {
        dNm: "",
        dDsc: "",
        dVerNo: "",
        dVerStat: "",
        dRunFldVer: "",
        dCId: $scope.RBCCode,
        dsVid: "",
        dsEId: "",
        dbOp: "I",
        eAr: [],
        disable: 'true',
        lAr: [],
        dO: {
            "legy": {},
            "std": {},
            "call": {},
            "custdocs": {},
            "skurefer": {}
        },
        fib: {},
        careArr: [],
        dsOrderDetail: []
    };
    var datasetDetails = $scope.datasetDetail;
    $scope.datasetList = {};
    $scope.datasetId = '';
    $scope.editDatasetCheck = false;
    var fieldPromptSetFlag = false;
    $scope.varLookup = false;
    $scope.gotoglid = function() {
        $location.path("/editGlid");
    };
    $rootScope.getTimeStampForCurrentDate = function() {
        var chars = "01";
        var todayDate = new Date();
        var todayDateMilli = todayDate.valueOf();
        var dateMilli = Date.parse("Jan 1, 2010");
        var dateDiff = todayDateMilli - dateMilli;
        var randomNo = dateDiff + Math.round(Math.random() * 100) + Math.round(Math.random() * 100) + Math.round(Math.random() * 100);
        return dateDiff;
    };
    $scope.viewmodefun = function() {
        $scope.varLookup = false;
        $scope.editDatasetCheck = true;
        $scope.isedit = true;
        $scope.editmode = true;
        $scope.viewmode = false;
        buttonvalidations();
        buttonvalidationsDOMview();
    }

    function buttonvalidations() {

        angular.forEach($scope.datasetDetail.eAr, function(dsElement) {
            if (dsElement.gridPr.typ === 'DataSource') {
                $scope.datasourceExist = true;
            }
        });

        // edit but view mode
        if ($scope.editDatasetCheck == true && $scope.isedit == true) {
            // fiber
            if (Object.keys($scope.datasetDetail.fib).length == 0) {
                $scope.editfiber = false;
                $scope.createfiber = false;
                $scope.viewfiber = false;
                $scope.deletefiber = false;
            } else if (Object.keys($scope.datasetDetail.fib).length > 0) {
                $scope.editfiber = true;
                $scope.createfiber = false;
                $scope.viewfiber = true;
                $scope.deletefiber = true;
            }
            // care ins
            if ($scope.datasetDetail.careArr.length == 0) {
                $scope.editcareins = false;
                $scope.createcareins = false;
                $scope.viewcareins = false;
                $scope.deletecareins = false;
            } else if ($scope.datasetDetail.careArr.length > 0) {

                $scope.editcareins = true;
                $scope.createcareins = false;
                $scope.viewcareins = true;
                $scope.deletecareins = true;
            }

            // lookup arr
            if ($scope.datasetDetail.lAr.length == 0) {
                $scope.editlAr = false;
                $scope.createlAr = false;
                $scope.viewlAr = false;
                $scope.deletelAr = false;
            } else if ($scope.datasetDetail.lAr.length > 0) {

                $scope.editlAr = true;
                $scope.createlAr = false;
                $scope.viewlAr = true;
                $scope.deletelAr = true;
            }

            // manual seq
            if ($scope.datasetDetail.dO.std != undefined) {
                if (Object.keys($scope.datasetDetail.dO.std).length == 0) {
                    $scope.editstd = false;
                    $scope.createstd = false;
                    $scope.viewstd = false;
                    $scope.deletestd = false;
                } else if (Object.keys($scope.datasetDetail.dO.std).length > 0) {
                    $scope.editstd = false;
                    $scope.createstd = false;
                    $scope.viewstd = true;
                    $scope.deletestd = false;
                }
            }

            // callout seq
            if ($scope.datasetDetail.dO.call != undefined) {
                if (Object.keys($scope.datasetDetail.dO.call).length == 0) {
                    $scope.editcall = false;
                    $scope.createcall = false;
                    $scope.viewcall = false;
                    $scope.deletecall = false;
                } else if (Object.keys($scope.datasetDetail.dO.call).length > 0) {
                    $scope.editcall = false;
                    $scope.createcall = false;
                    $scope.viewcall = true;
                    $scope.deletecall = false;
                }
            }
            // legacy seq
            if ($scope.datasetDetail.dO.legy != undefined) {
                if (Object.keys($scope.datasetDetail.dO.legy).length == 0) {
                    $scope.editlegy = false;
                    $scope.createlegy = false;
                    $scope.viewlegy = false;
                    $scope.deletelegy = false;
                } else if (Object.keys($scope.datasetDetail.dO.legy).length > 0) {
                    $scope.editlegy = false;
                    $scope.createlegy = false;
                    $scope.viewlegy = true;
                    $scope.deletelegy = false;
                }
            }
            // custdocs seq
            if ($scope.datasetDetail.dO.custdocs != undefined) {
                if (Object.keys($scope.datasetDetail.dO.custdocs).length == 0) {
                    $scope.editcustdocs = false;
                    $scope.createcustdocs = false;
                    $scope.viewcustdocs = false;
                    $scope.deletecust = false;
                } else if (Object.keys($scope.datasetDetail.dO.custdocs).length > 0) {
                    $scope.editcustdocs = false;
                    $scope.createcustdocs = false;
                    $scope.viewcustdocs = true;
                    $scope.deletecust = false;
                }
            }

            // skurefer seq
            if ($scope.datasetDetail.dO.skurefer != undefined) {
                if (Object.keys($scope.datasetDetail.dO.skurefer).length == 0) {
                    $scope.editskurefer = false;
                    $scope.createskurefer = false;
                    $scope.viewskurefer = false;
                    $scope.deleteskurefer = false;
                } else if (Object.keys($scope.datasetDetail.dO.skurefer).length > 0) {
                    $scope.editskurefer = false;
                    $scope.createskurefer = false;
                    $scope.viewskurefer = true;
                    $scope.deleteskurefer = false;
                }
            }

        } else if ($scope.editDatasetCheck == false && $scope.isedit == true) {
            // edit and edit mode

            // fiber
            if (Object.keys($scope.datasetDetail.fib).length == 0) {
                $scope.editfiber = false;
                $scope.createfiber = true;
                $scope.viewfiber = false;
                $scope.deletefiber = false;
            } else if (Object.keys($scope.datasetDetail.fib).length > 0) {
                $scope.editfiber = true;
                $scope.createfiber = false;
                $scope.viewfiber = false;
                $scope.deletefiber = true;
            }

            // care
            if ($scope.datasetDetail.careArr.length == 0) {
                $scope.editcareins = false;
                $scope.createcareins = true;
                $scope.viewcareins = false;
                $scope.deletecareins = false;
            } else if ($scope.datasetDetail.careArr.length > 0) {
                $scope.editcareins = true;
                $scope.createcareins = false;
                $scope.viewcareins = false;
                $scope.deletecareins = true;
            }

            // care
            if ($scope.datasetDetail.lAr.length == 0) {
                $scope.editlAr = false;
                $scope.createlAr = false;
                $scope.viewlAr = false;
                $scope.deletelAr = false;
            } else if ($scope.datasetDetail.lAr.length > 0) {

                $scope.editlAr = true;
                $scope.createlAr = false;
                $scope.viewlAr = true;
                $scope.deletelAr = true;
            }

            // manual seq
            if ($scope.datasetDetail.dO.std != undefined) {
                if (Object.keys($scope.datasetDetail.dO.std).length == 0) {
                    $scope.editstd = false;
                    $scope.createstd = true;
                    $scope.viewstd = false;
                    $scope.deletestd = false;
                } else if (Object.keys($scope.datasetDetail.dO.std).length > 0) {
                    $scope.editstd = true;
                    $scope.createstd = false;
                    $scope.viewstd = false;
                    $scope.deletestd = true;
                }
            }
            // callout seq
            if ($scope.datasetDetail.dO.call != undefined) {
                if (Object.keys($scope.datasetDetail.dO.call).length == 0) {
                    $scope.editcall = false;
                    $scope.createcall = true;
                    $scope.viewcall = false;
                    $scope.deletecall = false;
                } else if (Object.keys($scope.datasetDetail.dO.call).length > 0) {
                    $scope.editcall = true;
                    $scope.createcall = false;
                    $scope.viewcall = false;
                    $scope.deletecall = true;
                }
            }
            // legacy seq
            if ($scope.datasetDetail.dO.legy != undefined) {
                if (Object.keys($scope.datasetDetail.dO.legy).length == 0) {
                    $scope.editlegy = false;
                    $scope.createlegy = true;
                    $scope.viewlegy = false;
                    $scope.deletelegy = false;
                } else if (Object.keys($scope.datasetDetail.dO.legy).length > 0) {
                    $scope.editlegy = true;
                    $scope.createlegy = false;
                    $scope.viewlegy = false;
                    $scope.deletelegy = true;
                }
            }
            // custdocs seq
            if ($scope.datasetDetail.dO.custdocs != undefined) {
                if (Object.keys($scope.datasetDetail.dO.custdocs).length == 0) {
                    $scope.editcustdocs = false;
                    $scope.createcustdocs = true;
                    $scope.viewcustdocs = false;
                    $scope.deletecust = false;
                } else if (Object.keys($scope.datasetDetail.dO.custdocs).length > 0) {
                    $scope.editcustdocs = true;
                    $scope.createcustdocs = false;
                    $scope.viewcustdocs = false;
                    $scope.deletecust = true;
                }
            }
            //skurefer seq
            if ($scope.datasetDetail.dO.skurefer != undefined) {
                if (Object.keys($scope.datasetDetail.dO.skurefer).length == 0) {
                    $scope.editskurefers = false;
                    $scope.createskurefer = true;
                    $scope.viewskurefer = false;
                    $scope.deleteskurefer = false;
                } else if (Object.keys($scope.datasetDetail.dO.skurefer).length > 0) {
                    $scope.editskurefer = true;
                    $scope.createskurefer = false;
                    $scope.viewskurefer = false;
                    $scope.deleteskurefer = true;
                }
            }
        }
    };

    function buttonvalidationsDOMview() {
        if (SaveViewUpdateDeleteGlobal != undefined) {
            if (SaveViewUpdateDeleteGlobal.standard != undefined) {
                if (SaveViewUpdateDeleteGlobal.standard.length == 0) {
                    $scope.viewstd = false;
                } else if (SaveViewUpdateDeleteGlobal.standard.length > 0) {
                    $scope.viewstd = true;
                }
            }
            if (SaveViewUpdateDeleteGlobal.callout != undefined) {
                if (SaveViewUpdateDeleteGlobal.callout.length == 0) {
                    $scope.viewcall = false;
                } else if (SaveViewUpdateDeleteGlobal.callout.length > 0) {
                    $scope.viewcall = true;
                }
            }
            if (SaveViewUpdateDeleteGlobal.legacy != undefined) {
                if (SaveViewUpdateDeleteGlobal.legacy.length == 0) {
                    $scope.viewlegy = false;
                } else if (SaveViewUpdateDeleteGlobal.legacy.length > 0) {
                    $scope.viewlegy = true;
                }
            }
            if (SaveViewUpdateDeleteGlobal.customerdocs != undefined) {
                if (SaveViewUpdateDeleteGlobal.customerdocs.length == 0) {
                    $scope.viewcustdocs = false;
                } else if (SaveViewUpdateDeleteGlobal.customerdocs.length > 0) {
                    $scope.viewcustdocs = true;
                }
            }
            if (SaveViewUpdateDeleteGlobal.skureference != undefined) {
                if (SaveViewUpdateDeleteGlobal.skureference.length == 0) {
                    $scope.viewskurefer = false;
                } else if (SaveViewUpdateDeleteGlobal.skureference.length > 0) {
                    $scope.viewskurefer = true;
                }
            }
        }
    }
    //Edit Mode
    function buttonvalidationsDOMEditMode() {
        if (SaveViewUpdateDeleteGlobal != undefined) {
            if (SaveViewUpdateDeleteGlobal.standard != undefined) {
                if (SaveViewUpdateDeleteGlobal.standard.length == 0) {
                    $scope.editstd = false;
                    $scope.deletestd = false;
                    $scope.createstd = true;
                } else if (SaveViewUpdateDeleteGlobal.standard.length > 0) {
                    $scope.editstd = true;
                    $scope.deletestd = true;
                    $scope.createstd = false;
                }
            }
            if (SaveViewUpdateDeleteGlobal.callout != undefined) {
                if (SaveViewUpdateDeleteGlobal.callout.length == 0) {
                    $scope.editcall = false;
                    $scope.deletecall = false;
                    $scope.createcall = true;
                } else if (SaveViewUpdateDeleteGlobal.callout.length > 0) {
                    $scope.editcall = true;
                    $scope.deletecall = true;
                    $scope.createcall = false;
                }
            }
            if (SaveViewUpdateDeleteGlobal.legacy != undefined) {
                if (SaveViewUpdateDeleteGlobal.legacy.length == 0) {
                    $scope.editlegy = false;
                    $scope.deletelegy = false;
                    $scope.createlegy = true;
                } else if (SaveViewUpdateDeleteGlobal.legacy.length > 0) {
                    $scope.editlegy = true;
                    $scope.deletelegy = true;
                    $scope.createlegy = false;
                }
            }
            if (SaveViewUpdateDeleteGlobal.customerdocs != undefined) {
                if (SaveViewUpdateDeleteGlobal.customerdocs.length == 0) {
                    $scope.editcustdocs = false;
                    $scope.deletecust = false;
                    $scope.createcustdocs = true;
                } else if (SaveViewUpdateDeleteGlobal.customerdocs.length > 0) {
                    $scope.editcustdocs = true;
                    $scope.deletecust = true;
                    $scope.createcustdocs = false;
                }
            }
            if (SaveViewUpdateDeleteGlobal.skureference != undefined) {
                if (SaveViewUpdateDeleteGlobal.skureference.length == 0) {
                    $scope.editskurefer = false;
                    $scope.deleteskurefer = false;
                    $scope.createskurefer = true;
                } else if (SaveViewUpdateDeleteGlobal.skureference.length > 0) {
                    $scope.editskurefer = true;
                    $scope.deleteskurefer = true;
                    $scope.createskurefer = false;
                }
            }
        }


    }
    $scope.hidemdDialog = function() {
        $mdDialog.hide();
    }
    $scope.checkmaxlenthvalidation = function(attribute, index) {
        const max = attribute.gridPr.xLen;
        const min = attribute.gridPr.mLen;
        if (attribute.gridPr.xLen != null && attribute.gridPr.xLen != undefined && attribute.gridPr.xLen != "") {
            if (Number(attribute.gridPr.mLen) > Number(attribute.gridPr.xLen)) {
                $("#validation_" + index).css('display', 'inline');
            } else {
                $("#validation_" + index).css('display', 'none');
            }
        }
    };
    $scope.onload = function() {
        console.log("indise onload Datasets");
        $scope.hidemdDialog();
        $scope.loading = true;
        var editdataset = localStoreService.get('editdataset');
        console.log("editdataset: ", editdataset);
        console.log("localStoreService.get('editdatasetdetails'): ", localStoreService.get('editdatasetdetails'));
        if (editdataset != null && editdataset != undefined && editdataset != false) {
            var editdetails = localStoreService.get('editdatasetdetails');
            DataSourceService.getdatasourcedetails(editdetails['versionId']).then(
                function(data) {
                    $scope.datasetDetail = data.responseData;
                    angular.forEach($scope.datasetDetail.eAr, function(dsElement) {
                        if (dsElement.gridPr.typ == 'Calculation') {
                            LogicRefServices.getAllFieldRulesByFieldId(dsElement.gridPr.fId)
                                .then(function successCallback(data) {
                                    dsElement["rules"] = data;
                                    $scope.RuleList = data;
                                    if (dsElement.gridPr.ruleId != undefined) {
                                        let ruleName = '';
                                        data.forEach(function(rule) {
                                            if (rule.fieldRuleId == dsElement.gridPr.ruleId) {
                                                ruleName = rule.ruleName;
                                                dsElement.ruleTxt = ruleName;
                                                let tempObj = {};
                                                tempObj["eid"] = dsElement.eId;
                                                tempObj["ruleId"] = rule.fieldRuleId;
                                                tempObj["blocklyJs"] = rule.blocklyJs;
                                                tempObj["blocklyXml"] = rule.blocklyXml;
                                                dsElement["ruleSelected"] = tempObj;

                                            }
                                        })
                                        var selectObj = document.getElementById("ruleDropdown");
                                        for (var i = 0; i < selectObj.options.length; i++) {
                                            if (selectObj.options[i].text == ruleName) {
                                                selectObj.options[i].selected = true;
                                            }
                                        }
                                    }
                                })
                        }

                    })
                    cnt.ViewDataSourceDom = data.responseData;
                    SaveViewUpdateDeleteGlobal = data.responseData;
                    viewDataSourceGlobal = data.responseData;
                    ViewFlag = true;
                    VersionGlobal = data.responseData.dsVid;
                    $rootScope.dataSetVersNum = $scope.datasetDetail.dVerNo;
                    $rootScope.dataSetuTransId = $scope.datasetDetail.uTransId;
                    $rootScope.dataSetdsVid = $scope.datasetDetail.dsVid;
                    $rootScope.dataSetdDsc = $scope.datasetDetail.dDsc;
                    angular.forEach($scope.datasetDetail.eAr, function(attribute) {
                        attribute['ischecked'] = false;
                        attribute['disable'] = 'true';
                    });
                    if ($scope.datasetDetail.dO.std == undefined) {
                        $scope.datasetDetail.dO["std"] = {};
                    }
                    if ($scope.datasetDetail.dO.call == undefined) {
                        $scope.datasetDetail.dO["call"] = {};
                    }
                    if ($scope.datasetDetail.dO.legy == undefined) {
                        $scope.datasetDetail.dO["legy"] = {};
                    }
                    if ($scope.datasetDetail.dO.custdocs == undefined) {
                        $scope.datasetDetail.dO["custdocs"] = {};
                    }
                    if ($scope.datasetDetail.dO.skurefer == undefined) {
                        $scope.datasetDetail.dO["skurefer"] = {};
                    }
                    if ($scope.varLookup == true) {
                        $scope.editDatasetCheck = false;
                        $scope.editmode = false;
                        $scope.viewmode = true;
                    } else {

                        $scope.editDatasetCheck = true;
                        $scope.isedit = true;
                        $scope.editmode = true;
                        $scope.viewmode = false;

                    }
                    $scope.loading = false;
                    buttonvalidations();

                    console.log($scope.datasetDetail);
                },
                function(errorMessage) {
                    console.log('error');
                });

        } else {

            var datasetarray = [];
            for (var i = 0; i < 5; i++) {
                var dsMotherTimeStamp = $rootScope.getTimeStampForCurrentDate();
                var timeStampBasedId = dsMotherTimeStamp + i;
                var elemeent = {
                    "sequence": i + 1,
                    "disable": 'true',
                    "eId": timeStampBasedId,
                    "dbOp": "I",
                    "gridPr": {
                        "fIdCid": $scope.RBCCode,
                        "fId": "",
                        "eNm": "",
                        "typ": "",
                        "rqd": false,
                        "cas": "N",
                        "msk": "",
                        "mLen": "",
                        "xLen": ""
                    },
                    "popPr": "",
                    "barPr": "",
                    "helptxtPr": "",
                    "rules": [],
                    "ruleTxt": "",
                    "ruleSelected": {}
                };
                datasetarray.push(elemeent);
            }
            $scope.datasetDetail.eAr = datasetarray;
        }
        DatasetService.getAllDatasets($scope.RBCCode).then(
            function(data) {
                $scope.datasetList = data;
                $scope.loading = false;
                console.log("DatasetList" + data)
            },
            function(errorMessage) {
                console.log('error');
            });
        if (localStoreService.get("listBoxFlag") == true) {
            $scope.datasetDetail = localStoreService.get("datasetDetails");
        }
    }

    $scope.onload();

    $scope.elementRuleSelection = function(elementId) {
        var elementRule = {};
        angular.forEach($scope.datasetDetail.eAr, function(dsElement) {
            if (dsElement.eId === elementId) {
                angular.forEach($scope.RuleList, function(rule) {
                    if (rule.ruleName == dsElement.ruleTxt) {
                        elementRule = rule;
                    }
                })
                let tempObj = {};
                tempObj["eid"] = elementId;
                tempObj["ruleId"] = elementRule.fieldRuleId;
                tempObj["blocklyJs"] = elementRule.blocklyJs;
                tempObj["blocklyXml"] = elementRule.blocklyXml;
                dsElement["ruleSelected"] = tempObj;
                dsElement.gridPr["ruleId"] = elementRule.fieldRuleId;
                $rootScope.openToast("Rule selection Successfull", 3000, "autoClose");
            }
        });
    }

    $scope.showeditdatasetPopup = function($event) {
        $event.preventDefault();
        $mdDialog.show({
                controller: EditDatasetPopupController,
                templateUrl: 'html/dw/evdp/editdatasetalert.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: { parentScope: $scope }
            })
            .then(function() {

            }, function(error) {
                console.log(error);
            });
    };

    function EditDatasetPopupController($scope, $mdDialog, $rootScope, parentScope) {
        $scope.cancel = $mdDialog.cancel;
        $scope.hide = $mdDialog.hide;

        $scope.editdataset = function() {
            parentScope.editDatasetCheck = false;
            parentScope.editmode = false;
            parentScope.viewmode = true;
            buttonvalidations();
            buttonvalidationsDOMEditMode();
            $scope.hide();
        }
    }
    $scope.addemptyRows = function() {
        var length = $scope.datasetDetail.eAr.length;
        for (var i = 0; i < 5; i++) {
            var dsMotherTimeStamp = $rootScope.getTimeStampForCurrentDate();
            var x = parseInt(length + 1);
            var timeStampBasedId = dsMotherTimeStamp + x;

            var elemeent = {
                "sequence": length + 1,
                "disable": 'true',
                "eId": timeStampBasedId,
                "dbOp": "I",
                "gridPr": {
                    "fIdCid": $scope.RBCCode,
                    "fId": "",
                    "eNm": "",
                    "typ": "",
                    "rqd": false,
                    "cas": "N",
                    "msk": "",
                    "mLen": "",
                    "xLen": ""
                },
                "popPr": "",
                "barPr": "",
                "helptxtPr": ""
            };
            $scope.datasetDetail.eAr.push(elemeent);
        }
    };
    $scope.getDatasetDetails = function() {
        console.log($scope.datasetId);
        if ($scope.datasetId) {
            $scope.loading = true;
            DatasetService.getDatasetDetails($scope.datasetId).then(
                function(data) {
                    $scope.promoteData = data;
                    $rootScope.PopUpdata = data;
                    $rootScope.datasetDetail = $scope.datasetDetail;
                    if (data != "") {
                        $scope.datasetDetail.dNm = data.datasetNumber;
                        $scope.datasetDetail.dDsc = data.description;
                        $scope.datasetDetail.dVerNo = "";
                        $scope.datasetDetail.dVerStat = "";
                        var elements = data.datasetElementListVO;
                        if (elements.length > 0) {
                            $scope.datasetDetail.eAr = [];
                            for (var i = 0; i < elements.length; i++) {
                                var flag = "";
                                if (elements[i].requiredFlag = 'Y') {
                                    flag = true;
                                } else {
                                    flag = false;
                                }
                                var barcode = {};
                                if (elements[i].dsElementBarcodeVO != null && elements[i].dsElementBarcodeVO != "") {
                                    barcode = {
                                        "sym": elements[i].dsElementBarcodeVO.symbiology,
                                        "dMsk": elements[i].dsElementBarcodeVO.dataMask,
                                        "dBhv": elements[i].dsElementBarcodeVO.chkDigitBehaviour,
                                        "dCal": elements[i].dsElementBarcodeVO.chkDigitCalc,
                                        "ucc": elements[i].dsElementBarcodeVO.uccEan13,
                                        "encType": elements[i].dsElementBarcodeVO.encodingType,
                                        "sscc": elements[i].dsElementBarcodeVO.sscc18,
                                        "cellSize": elements[i].dsElementBarcodeVO.cellSize,
                                        "fmtSize": elements[i].dsElementBarcodeVO.formatSize,
                                        "mode": elements[i].dsElementBarcodeVO.barcodeMode,
                                        "cols": elements[i].dsElementBarcodeVO.barcodeColumns,
                                        "rows": elements[i].dsElementBarcodeVO.barcodeRows,
                                        "corrLev": elements[i].dsElementBarcodeVO.correctionLevel,
                                        "trunc": elements[i].dsElementBarcodeVO.truncatedFlag,
                                        "shwNum": elements[i].dsElementBarcodeVO.showNumber,
                                        "shoMod10": elements[i].dsElementBarcodeVO.showMod10,
                                        "shoMod11": elements[i].dsElementBarcodeVO.showMod11,
                                        "shoMod103": elements[i].dsElementBarcodeVO.showMod103,
                                        "suplement": elements[i].dsElementBarcodeVO.supplement,
                                        "startstop": elements[i].dsElementBarcodeVO.stopStartChar
                                    };
                                }
                                var dsMotherTimeStamp = $rootScope.getTimeStampForCurrentDate();
                                var timeStampBasedId = dsMotherTimeStamp + i;
                                var elemeent = {
                                    "sequence": length + 1,
                                    "disable": 'false',
                                    "eId": timeStampBasedId,
                                    "dbOp": "I",
                                    "gridPr": {
                                        "fIdCid": $scope.RBCCode,
                                        "fId": elements[i].fieldId,
                                        "eNm": elements[i].elementName,
                                        "typ": elements[i].elementType,
                                        "rqd": flag,
                                        "cas": elements[i].case_,
                                        "msk": "",
                                        "mLen": elements[i].min,
                                        "xLen": elements[i].max
                                    },
                                    "popPr": {},
                                    "barPr": barcode,
                                    "helptxtPr": ""
                                };
                                if (elements[i].elementType === 'Calculation') {
                                    LogicRefServices.getAllFieldRulesByFieldId(elements[i].fieldId).then(function(data) {
                                        elemeent["fieldRulesArr"] = data;

                                    });
                                }
                                $scope.datasetDetail.eAr.push(elemeent);
                            }
                        }
                    } else {
                        $scope.datasetDetail = {
                            dNm: "",
                            dDsc: "",
                            dVerNo: "",
                            dVerStat: "",
                            dRunFldVer: "",
                            dCId: $scope.RBCCode,
                            dsVid: "",
                            dsEId: "",
                            dbOp: "I",
                            eAr: [],
                            disable: 'true'
                        };
                    }
                    $scope.loading = false;
                },
                function(errorMessage) {
                    console.log('error');
                }
            );
        }
    }

    $scope.onClickFieldRule = function(fieldId) {
        angular.forEach($scope.datasetDetail.eAr, function(elem) {
            if (elem.gridPr.fId === fieldId) {
                angular.forEach(elem.fieldRulesArr, function(rules) {
                    if (rules.field.fieldId === fieldId) {
                        elem.popPr["calcTxt"] = JSON.parse(rules.blocklyJs).json;
                        console.log(elem.popPr.calcTxt);
                    }
                });
            }
        });
    }

    $scope.tableShowEdit = function(editEvent) {
        editEvent.currentTarget.children[0].children[0].style.visibility = "visible";
    };

    $scope.tableHideEdit = function(editEvent) {
        editEvent.currentTarget.children[0].children[0].style.visibility = "hidden";
    };
    $scope.removeattribute = function() {
        for (var index = 0; index < $scope.datasetDetail.eAr.length; index++) {
            if ($scope.datasetDetail.eAr[index].ischecked == true) {
                $scope.datasetDetail.eAr.splice(index, 1);
                index = index - 1;
            }
        }
        for (var j = 0; j < $scope.datasetDetail.eAr.length; j++) {
            $scope.datasetDetail.eAr[j].sequence = j + 1;
        }
        $rootScope.openToast("field is removed from the list", 3000, "autoClose");
        $window.scrollTo(0, 0);
    };
    $scope.deleteattribute = function(attribute, index) {
        attribute.ischecked = true;
        $mdDialog.show({
                controller: ElementDeletePopupController,
                templateUrl: 'html/dw/layering/Delete-Element.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: { parentScope: $scope }
            })
            .then(function() {


            }, function(error) {
                console.log(error);
            });
    };
    $scope.selectElement = function(elements) {
        $scope.isallchecked = false;
        var selectedElements = $scope.datasetDetail.eAr.filter(elements => elements.ischecked);
        if (selectedElements.length > 0) {
            if (selectedElements.length == $scope.datasetDetail.eAr.length)
                $scope.isallchecked = true;
            $scope.deleteButtonFlag = true;
        } else {
            $scope.deleteButtonFlag = false;
        }
        if (elements.ischecked == true) {
            elements.disable = 'false';
        } else {
            elements.disable = 'true';
        }

    };
    $scope.showDeletePopup = function($event) {
        $event.preventDefault();
        $mdDialog.show({
                controller: ElementDeletePopupController,
                templateUrl: 'html/dw/layering/Delete-Element.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: { parentScope: $scope }
            })
            .then(function() {


            }, function(error) {
                console.log(error);
            });
    };

    function ElementDeletePopupController($scope, $mdDialog, $rootScope, parentScope) {
        $scope.cancel = $mdDialog.cancel;
        $scope.hide = $mdDialog.hide;

        $scope.ok = function() {
            parentScope.removeattribute();
            $scope.hide();
        }
    }
    $scope.selectall = function() {
        if ($scope.isallchecked == true) {
            angular.forEach($scope.datasetDetail.eAr, function(attribute) {
                attribute.ischecked = true;
            });
            if ($scope.datasetDetail.eAr.length > 0) {
                $scope.deleteButtonFlag = true;
            }

        } else if ($scope.isallchecked == false) {
            angular.forEach($scope.datasetDetail.eAr, function(attribute) {
                attribute.ischecked = false;
                $scope.deleteButtonFlag = false;
            });
        }
    };
    $scope.changeFieldNameToUpperCase = function(element) {
        let invalidPattern = /\W/g;
        if (element.gridPr.eNm && element.gridPr.eNm.match(invalidPattern))
            element.gridPr.eNm = element.gridPr.eNm.replace(invalidPattern, "");
        if (element.gridPr.eNm)
            element.gridPr.eNm = element.gridPr.eNm.toUpperCase();
        if (!fieldPromptSetFlag)
            element.fieldPrompt = element.gridPr.eNm;

    };
    $scope.fieldpopup = function(attribute) {
        $scope.selectedattribute = attribute;
        $mdDialog.show({
            controller: FieldsetCtrl,
            templateUrl: 'html/dw/layering/AvailableFiledList.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: { dataToPass: $scope }

        }).then(function(rbcName) {

        }, function() {
            $scope.status = 'Failed to load Search';
        });

    };
    $scope.openmasterattributeslist = function($event, fieldname) {
        $scope.selectedattribute = "";
        $mdDialog.show({
            controller: FieldsetCtrl,
            templateUrl: 'html/dw/layering/AvailableFiledList.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: { dataToPass: $scope }

        }).then(function(rbcName) {

        }, function() {
            $scope.status = 'Failed to load Search';
        });
        $event.preventDefault();
        // 				
    };

    function FieldsetCtrl($scope, $mdDialog, dataToPass, DatasetService) {

        var parentscope = dataToPass;
        parentscope.rbccode = parentscope.rbcCode;
        $scope.masterattributelist = [];
        $scope.selectedAttributes = [];
        $scope.FieldOkButtonFlag = false;
        $scope.currentPage = 1;
        $scope.pages = [
            { name: 20, value: 20 },
            { name: 50, value: 50 },
            { name: 100, value: 100 }
        ];
        $scope.pageSize = $scope.pages[0].value;
        $scope.onLoadFun = function() {
            $scope.loading = true;
            DatasetService.getMasterAttributes(parentscope.rbccode).then(
                function(data) {
                    //$scope.masterattributelist = data.responseData;
                    $scope.masterattributelist = data;
                    $scope.loading = false;
                    $("#addnewdiv").css('display', 'none');
                },
                function(errorMessage) {
                    console.log('error');
                });
        };
        $scope.selectallfields = function() {
            if ($scope.isallchecked == true) {
                $scope.selectedAttributes = [];
                angular.forEach($scope.masterattributelist, function(attribute) {
                    attribute.ischecked = true;
                    $scope.addfieldstodataset(attribute);
                });

                if ($scope.selectedAttributes.length > 0) {
                    $scope.FieldOkButtonFlag = true;
                }
            } else if ($scope.isallchecked == false) {
                $scope.FieldOkButtonFlag = false;
                $scope.selectedAttributes = [];
                angular.forEach($scope.masterattributelist, function(attribute) {
                    attribute.ischecked = false;
                });
            }
            if ($scope.selectedAttributes.length > 0) {
                $scope.FieldOkButtonFlag = true;
            } else {
                $scope.FieldOkButtonFlag = false;
            }
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.addfieldstodataset = function(field) {
            if (field.caseType == null || field.caseType == undefined) {
                field.caseType = "N";
            }
            if (field.ischecked == true) {
                if (field.mandatory == "Yes") {
                    field.mandatory = "Y";
                } else if (field.mandatory == "Optional" || field.mandatory == "No" || field.mandatory == null || field.mandatory == "") {
                    field.mandatory = "N";
                }
                var barcode = "";
                if (field.dsElementBarcodeVO != null && field.dsElementBarcodeVO != "") {
                    barcode = {
                        "sym": field.dsElementBarcodeVO.symbiology,
                        "dMsk": field.dsElementBarcodeVO.dataMask,
                        "dBhv": field.dsElementBarcodeVO.chkDigitBehaviour,
                        "dCal": field.dsElementBarcodeVO.chkDigitCalc,
                        "ucc": field.dsElementBarcodeVO.uccEan13,
                        "encType": field.dsElementBarcodeVO.encodingType,
                        "sscc": field.dsElementBarcodeVO.sscc18,
                        "cellSize": field.dsElementBarcodeVO.cellSize,
                        "fmtSize": field.dsElementBarcodeVO.formatSize,
                        "mode": field.dsElementBarcodeVO.barcodeMode,
                        "cols": field.dsElementBarcodeVO.barcodeColumns,
                        "rows": field.dsElementBarcodeVO.barcodeRows,
                        "corrLev": field.dsElementBarcodeVO.correctionLevel,
                        "trunc": field.dsElementBarcodeVO.truncatedFlag,
                        "shwNum": field.dsElementBarcodeVO.showNumber,
                        "shoMod10": field.dsElementBarcodeVO.showMod10,
                        "shoMod11": field.dsElementBarcodeVO.showMod11,
                        "shoMod103": field.dsElementBarcodeVO.showMod103,
                        "suplement": field.dsElementBarcodeVO.supplement,
                        "startstop": field.dsElementBarcodeVO.stopStartChar
                    };
                }
                var fieldprop = "";
                if (field.fieldPropertiesVO != null && field.fieldPropertiesVO != "") {
                    fieldprop = {
                        lNm: field.fieldPropertiesVO.listVersionId,
                        lId: field.fieldPropertiesVO.listId,
                        cId: rbcId,
                        //description: $scope.currentProperty.desc,
                        lock: field.fieldPropertiesVO.lockedFlag,
                        pSearch: field.fieldPropertiesVO.progressiveSearchFlag,
                        lnkFlds: field.fieldPropertiesVO.noOfLinkedFields,
                        key1: field.fieldPropertiesVO.key1,
                        key2: field.fieldPropertiesVO.key2,
                        key3: field.fieldPropertiesVO.key3,
                        key4: field.fieldPropertiesVO.key4,
                        key5: field.fieldPropertiesVO.key5,
                        multiSel: field.fieldPropertiesVO.multiSelectFlag,
                        mxSel: field.fieldPropertiesVO.noOfMaximumSelections
                    };
                }
                var masterfield = {
                    "sequence": 0,
                    "disable": 'true',
                    "eId": '',
                    "dbOp": "I",
                    "gridPr": {
                        "fIdCid": parentscope.RBCCode,
                        "fId": field.fieldId,
                        "eNm": field.fieldName,
                        "typ": field.fieldType,
                        "rqd": field.mandatory,
                        "cas": field.caseType,
                        "msk": "",
                        "mLen": field.minCharLen,
                        "xLen": field.maxCharLen
                    },
                    "popPr": fieldprop,
                    "msk": field.customMaskFlag + field.mask,
                    "barPr": barcode,
                    "helptxtPr": ""
                };
                $scope.selectedAttributes.push(masterfield);
            } else if (field.ischecked == false) {
                for (var i = $scope.selectedAttributes.length; i--;) {
                    if ($scope.selectedAttributes[i].gridPr.eNm == field.fieldName) {
                        $scope.selectedAttributes.splice(i, 1);
                        i = i - 1;
                    }
                }
            }
            if ($scope.selectedAttributes.length > 0) {
                $scope.FieldOkButtonFlag = true;
            } else {
                $scope.FieldOkButtonFlag = false;
            }
        };

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.CancelDialogue = function() {
            $mdDialog.cancel();
        };
        $scope.SaveToAttribuites = function() {
            if (parentscope.datasetDetail.eAr == undefined || parentscope.datasetDetail.eAr == null) {
                parentscope.datasetDetail['eAr'] = [];
            }
            if ($scope.selectedAttributes.length != 0) {
                if ($scope.selectedAttributes.length == 1 && parentscope.selectedattribute != undefined && parentscope.selectedattribute != "" && parentscope.selectedattribute != null) {
                    parentscope.selectedattribute.gridPr.rqd = $scope.selectedAttributes[0].gridPr.rqd;
                    parentscope.selectedattribute.gridPr.eNm = $scope.selectedAttributes[0].gridPr.eNm;
                    parentscope.selectedattribute.gridPr.typ = $scope.selectedAttributes[0].gridPr.typ;
                    parentscope.selectedattribute.gridPr.mLen = $scope.selectedAttributes[0].gridPr.mLen;
                    parentscope.selectedattribute.gridPr.xLen = $scope.selectedAttributes[0].gridPr.xLen;
                    parentscope.selectedattribute.gridPr.cas = $scope.selectedAttributes[0].gridPr.cas;
                    parentscope.selectedattribute.gridPr.barPr -= $scope.selectedAttributes[0].gridPr.barPr;
                    parentscope.selectedattribute.gridPr.fId = $scope.selectedAttributes[0].gridPr.fId;
                    //parentscope.selectedattribute.rule=null;

                } else {
                    if ($scope.selectedAttributes.length != 0) {
                        for (var i = 0; i < parentscope.datasetDetail.eAr.length; i++) {
                            if (parentscope.datasetDetail.eAr[i].gridPr.eNm == "" || parentscope.datasetDetail.eAr[i].gridPr.eNm == null || parentscope.datasetDetail.eAr[i].gridPr.eNm == undefined) {
                                parentscope.datasetDetail.eAr.splice(i, 1);
                                i = i - 1;
                            }
                        }
                        angular.forEach($scope.selectedAttributes, function(attribute) {
                            var length = parentscope.datasetDetail.eAr.length;
                            attribute.sequence = length + 1;
                            attribute.disable = 'false';
                            //attribute.fIdCid = parentscope.RBCCode;
                            var dsMotherTimeStamp = $rootScope.getTimeStampForCurrentDate();
                            var x = parseInt(length + 1);
                            var timeStampBasedId = dsMotherTimeStamp + x;
                            attribute.eId = timeStampBasedId;
                            parentscope.datasetDetail.eAr.push(attribute)
                        });
                    }
                }
            }
            $mdDialog.cancel();
        };
        $scope.onLoadFun();
    };
    $scope.setMinCharOnChange = function(element) {
        if (element.gridPr.rqd == "Y" && element.gridPr.typ == "Numeric") {
            element.gridPr.mLen = 1;
        } else {
            element.gridPr.mLen = null;
            element.gridPr.xLen = null;
        }

        if (element.gridPr.typ == "Numeric" || element.gridPr.typ == "Text") {
            element.gridPr.cas = "N";
        }

        if (element.gridPr.typ == "Calculation") {
            element.gridPr.rqd = "N";
        }
        if (['Date', 'Lookup', 'Numeric'].includes(element.gridPr.typ) == true) {
            element.gridPr.cas = "N";
        }
    };

    // function BarCode
    $scope.showBarCode = function(createEvent, currentElements) {
        $scope.currentElements = currentElements;
        $mdDialog.show({
                controller: dsBarCodeController,
                templateUrl: 'html/dw/evdp/DataSourceBarcodeProperties.html',
                parent: angular.element(document.body),
                targetEvent: createEvent,
                clickOutsideToClose: false,
                locals: { dataToPass: $scope }
            })
            .then(function() {


            }, function(error) {
                console.log(error);
            });
    }

    // TODO: Below Barcode logic needed code refactoring

    function dsBarCodeController($scope, $rootScope, $timeout, $mdDialog, dataToPass) {
        var jsonObj = dataToPass.currentElements.barPr;
        parentScope = dataToPass;

        $scope.cell_tr = true;
        $scope.cdb_tr = true;
        $scope.cdc_tr = true;
        $scope.mode_tr = true;
        $scope.dm_tr = true;
        $scope.col_tr = true;
        $scope.row_tr = true;
        $scope.correct_tr = true;
        $scope.flag_tr = true;
        $scope.encoding_tr = true;
        $scope.cell_tr = true;
        $scope.format_tr = true;
        $scope.ucc_ean128_tr = false;
        $scope.encoding_tr = true;
        $scope.sscc_18_tr = false;
        $scope.shnumber_tr = false;
        $scope.shmod10_tr = false;
        $scope.shmod11_tr = false;
        $scope.shmod103_tr = false;
        $scope.suplement_tr = false;
        $scope.startStop_tr = false;

        if (jsonObj == null) {
            jsonObj = {
                "sym": null,
                "dMsk": null,
                "dBhv": null,
                "dCal": null,
                "ucc": null,
                "encType": null,
                "sscc": null,
                "cellSize": null,
                "fmtSize": null,
                "mode": null,
                "cols": "0",
                "rows": "0",
                "corrLev": "0",
                "trunc": null,
                "shwNum": null,
                "shoMod10": null,
                "shoMod11": null,
                "shoMod103": null,
                "suplement": null,
                "startstop": null
            };
        } else {
            jsonObj["dMsk"] = decodeURI(jsonObj["dMsk"]);
        }
        var first = true;
        var barcodeProperties = new Object();
        var barcodeJson = "";
        var chkStatusForBc = false;

        $timeout(function() {
            loaddsBarList();
        }, 500);

        function loaddsBarList() {
            console.log($("#Symbologies").val());
            if ($("#Symbologies").val() == "? undefined:undefined ?") {
                createOptions("Symbologies", symbology_options);
            }
            symbology_CODE128();
            setDefaultSymbology();
            // document.getElementById("cdb").selectedIndex = 0;
            if (!isJsonEmpty(jsonObj) && jsonObj['sym'] != null) {
                var symbology = jsonObj["sym"];
                var innerelement = $("#Symbologies");
                innerelement.val(jsonObj["sym"]);
                $scope.changeSymbology();
                for (var key in jsonObj) {
                    var innerelement = $("#bc_table :input[bcKey='" + key + "']");
                    setBarcodeValue(innerelement, jsonObj[key]);
                }
            }
            if (!isJsonEmpty(jsonObj) && jsonObj['sym'] != null) {
                if (jsonObj['dCal'] != null) {
                    $('#cdc').val(jsonObj['dCal']);
                    if (jsonObj['sym'] == 'CODE128') {
                        $scope.action_onCheck(jsonObj['dCal'], jsonObj['shoMod10']);
                    }

                }
                $('#dm').val(jsonObj["dMsk"]);
            }
            // $rootScope.dsIsGridPopupEditable( [ "bc_dsEditOrView" ]);
            chkStatusForBc = false;
            if ($("#Symbologies").val() == 'MSI') {
                $scope.changeCdb = onchange_cdb_msi;
                $scope.changeCdc = onchange_cdc_msi;
            } else if ($("#Symbologies").val() == 'CODABAR') {
                $scope.changeCdb = onchange_cdb_codabar;
            } else if ($("#Symbologies").val() == 'CODE128') {
                $scope.changeCdb = onchange_cdb_CODE128;
                $scope.changeCdc = onchange_cdc_code128;
                $('#ucc_ean128_cb').bind('click', action_onCheck1);
                $('#sscc_18_cc').bind('click', action_OnSsc1);
            } else if ($("#Symbologies").val() == 'CODE39') {
                $scope.changeCdb = onchange_cdb_code39;
            }
            if (!isJsonEmpty(jsonObj) && jsonObj['sym'] == 'CODE128') {
                if (jsonObj['sscc'] == 'T') {
                    document.getElementById("sscc_18_cc").checked = true;
                } else {
                    document.getElementById("sscc_18_cc").checked = false;
                }
            }

        }

        $scope.cancelBarcode = function() {
            var innerelements = $("#bc_table :input[bcKey]");
            for (var i = 0; i < innerelements.length; i++) {
                if ($(innerelements[i]).attr("type") == 'checkbox') {
                    $(innerelements[i]).checked = false;
                } else if ($(innerelements[i]).attr('bcKey') == 'sym') {
                    $(innerelements[i]).val('CODE128');
                } else {
                    $(innerelements[i]).val("");
                }
            }
            // dsClosePopup();
            $mdDialog.cancel();
        };

        function createOptions(selId, arr) {

            var selSelect = document.getElementById(selId);
            selSelect.options.length = 0;
            // Code fix for ADIM00001510154 -- Code128 fix
            var p = new Array();
            for (var i = 0; i < arr.length; i++) {
                var optn = document.createElement("OPTION");
                optn.text = arr[i].text;
                if (selId == "supTypeDMSK") {
                    optn.value = decodeURI(arr[i].value);
                } else {
                    optn.value = arr[i].value;
                }
                optn.selected = arr[i].selected;
                p.push(optn);
            }
            for (var i = 0; i < p.length; i++) {
                selSelect.add(p[i]);
            }

        }

        function getValueFromSelect(id) {
            var dd = document.getElementById(id);
            var selOpt = dd.options[dd.selectedIndex];
            return selOpt.value;

        }

        function symbology_CODABAR() {
            createOptions("cdb", cdb_codabar);
            $scope.changeCdb = onchange_cdb_codabar;
            document.getElementById("cdb").selectedIndex = 0;
            createOptions("cdc", cdc_codabar);
            document.getElementById("cdc").disabled = true;
            validate();
            display();
            check_forCODABAR();
            setDefaultValue();
        }

        function symbology_CODE128() {
            createOptions("cdb", cdb_CODE128);
            $scope.changeCdb = onchange_cdb_CODE128;
            createOptions("cdc", cdc_code128);
            createOptions("supTypeDMSK", sub_type1);
            $scope.changeCdc = onchange_cdc_code128;
            validate();
            display();
            check_forCODE128();
            setDefaultValue();
            // $('#cdc').trigger('change');
            $scope.changeCdc();
            document.getElementById('sscc_18_cc').disabled = true;
            // document.getElementById("shmod10").disabled = true;
            // document.getElementById("shmod103").disabled = true;
            $scope.action_onCheck();
        }

        function symbology_CODE39() {
            createOptions("cdb", cdb_code39);
            $scope.changeCdb = onchange_cdb_code39;
            document.getElementById("cdb").selectedIndex = 0;
            createOptions("cdc", cdc_code39);
            document.getElementById("cdc").disabled = true;
            validate();
            display();
            check_forCODE39();
            setDefaultValue();
        }

        function symbology_CODE93() {
            createOptions("cdb", cdb_code93);
            createOptions("cdc", cdc_code93);
            validate();
            display();
            check_forCODE93();
            setDefaultValue();
            $("#cdb").val("Add Check Digit");
        }

        function symbology_DATAMATRIX() {
            createOptions("cdb", cdb_datamatrix);
            createOptions("encoding_type", encode_datamatrix);
            createOptions("format_size", format_datamatrix);
            document.getElementById("cdb").disabled = true;
            document.getElementById("cdc").disabled = true;
            validate();
            check_fordm();
            setDefaultValue();
            $("#format_size").val("18x18");
        }

        function symbology_EAN13() {
            validate();
            display();
            createOptions("cdb", cdb_ean13);
            createOptions("cdc", cdc_ean13);
            check_forE13();
            createOptions("suplement", sup_ean13);
            setDefaultValue();

        }

        function symbology_EAN8() {
            createOptions("cdb", cdb_ean8);
            createOptions("cdc", cdc_ean8);
            createOptions("suplement", sup_ean8);
            validate();
            display();
            check_forE8();
            setDefaultValue();
        }

        function showNumberChkBox(status) {
            if (status) {
                $scope.shnumber_tr = true;
                document.getElementById("shnumber").disabled = false;
                document.getElementById("shnumber").checked = true;
                if (!isJsonEmpty(barcodeProperties) &&
                    barcodeProperties['shwNum'] == 'F') {
                    document.getElementById("shnumber").checked = false;
                }
            } else {
                document.getElementById("shnumber").checked = false;
                document.getElementById("shnumber").disabled = true;
                $scope.shnumber_tr = false;
            }
        }

        function symbology_INT2OF5() {
            createOptions("cdb", cdb_int);
            createOptions("cdc", cdc_int);
            $scope.changeCdb = onchange_cdb_int;
            document.getElementById("cdc").disabled = true;
            validate();
            display();
            check_forINT2OF5();
            setDefaultValue();
        }

        function symbology_MSI() {
            createOptions("cdb", cdb_msi);
            createOptions("cdc", cdc_msi);
            document.getElementById("cdc").disabled = true;
            $scope.changeCdb = onchange_cdb_msi;
            $scope.changeCdc = onchange_cdc_msi;
            validate();
            display();
            check_forMSI();
            setDefaultValue();
        }

        function showModChk10Box(mod10status) {
            if (mod10status) {
                $scope.shmod10_tr = true;
                $('#shmod10').attr('disabled', false);
            } else {
                $('#shmod10').prop('checked', false);
                $('#shmod10').attr('disabled', true);
                $scope.shmod10_tr = false;
            }
        }

        function showModChk11Box(mod11status) {
            if (mod11status) {
                $scope.shmod11_tr = true;
                $('#shmod11').attr('disabled', false);
            } else {
                $('#shmod11').attr('disabled', true);
                $('#shmod11').prop('checked', false);
                $scope.shmod11_tr = false;
            }
        }

        function symbology_PDF417() {
            createOptions("mode", mode_pdf417);
            createOptions("col", col_pdf417);
            createOptions("row", row_pdf417);
            createOptions("correct", correc_pdf417);
            document.getElementById("dm_tr").disabled = true;
            check_forpdf();
            validate();
            setDefaultValue();
        }

        function symbology_UPCA() {
            validate();
            display();
            createOptions("cdb", cdb_upca);
            createOptions("cdc", cdc_upca);
            createOptions("suplement", sup_upca);
            check_forUPCA();
            setDefaultValue();
        }

        function symbology_UPCE() {

            validate();
            display();

            createOptions("cdb", cdb_upce);
            createOptions("cdc", cdc_upce);
            createOptions("suplement", sup_upce);
            check_forUPCE();
            setDefaultValue();
        }

        function action_onCheck1() {
            $scope.action_onCheck();
        }

        function action_OnSsc1() {
            $scope.action_OnSsc();
        }

        function onchange_cdb_CODE128() {
            $scope.action_onCheck();
            // enableValues();
        }

        function enableValues() {

        }

        function onchange_cdc_code128() {
            // enableValues();
            $scope.action_onCheck($('#cdc').val());
        }

        function onchange_cdb_codabar() {
            disable();
        }

        function onchange_cdb_code39() {
            disable();
        }

        function onchange_cdb_int() {
            disable();
        }

        function onchange_cdb_msi() {
            disable();
            if ($('#cdb').val() == "Add Check Digit") {
                // showModChk10Box(true);
            } else {
                // showModChk10Box();
                // $('#cdc').val('Mod10');
            }
        }

        function onchange_cdc_msi() {
            if ($('#cdc').val() == "Mod10 & Mod11") {
                // showModChk11Box(true);
            } else {
                // showModChk11Box();
            }
        }



        $scope.changeSymbology = function() {
            document.getElementById("cdb").disabled = false;
            document.getElementById("cdc").disabled = false;
            var method_name = "symbology_" + getValueFromSelect("Symbologies") + "()";
            eval(method_name);
        };

        $scope.changeCdb = function() {};

        $scope.changeCdc = function() {};

        $scope.action_OnSsc = function() {
            if ($("#Symbologies").val() == 'CODE128') {
                $scope.action_onCheck();
            }
        };
        $scope.action_onCheck = function(elem, value) {
            // document.getElementById('sscc_18_cc').disabled = false;
            // document.getElementById("shmod10").disabled = false;
            // document.getElementById("shmod103").disabled = false;
            var cdbValue = $('#cdb').val();
            var uccChecked = document.getElementById('ucc_ean128_cb').checked;
            if (cdbValue != 'Add Check Digit') {
                $('#sscc_18_cc').prop('checked', false);
                // $('#shmod10').attr('checked', false);
                // $('#shmod103').attr('checked', false);
                document.getElementById('sscc_18_cc').disabled = true;
                // document.getElementById("shmod10").disabled = true;
                // document.getElementById("shmod103").disabled = true;
            }
            var elemc = document.getElementById("cdc");
            var i;
            if (elem == undefined) {
                for (i = elemc.length - 1; i >= 0; i--) {
                    elemc.remove(i);
                }
                $(elemc).end().remove();
            }

            var ssccChecked = document.getElementById('sscc_18_cc').checked;
            if (cdbValue == 'Add Check Digit' && uccChecked) {
                document.getElementById('sscc_18_cc').disabled = false;
                // document.getElementById("shmod10").disabled = false;
                // document.getElementById("shmod103").disabled = false;
                // if (document.getElementById("shmod103").disabled) {
                // document.getElementById("shmod103").disabled = false;
                // $('#shmod103').attr('checked', false);
                // }
            }
            if (uccChecked && ssccChecked) {
                if (elem == undefined) {
                    /*
                     * var newOption = document .createElement('<option
                     * value="Mod10 & Mod103">');
                     */

                    var newOption = document.createElement("option");
                    newOption.value = "Mod10 & Mod103";

                    elemc.add(newOption);
                    newOption.innerText = "Mod10 & Mod103";
                }
                $('#dm').val('' + $("#supTypeDMSK").find("option:contains('STARTC')").val() + $("#supTypeDMSK").find("option:contains('FNC1')").val() + '00');
                // if (document.getElementById("shmod10").disabled) {
                // document.getElementById("shmod10").disabled = false;
                // }
                // $('#shmod10').attr('checked', true);
            } else if (elem == undefined) {
                // var newOption1 = document.createElement('<option
                // value="Mod103">');
                var newOption1 = document.createElement("option");
                newOption1.value = "Mod103";
                elemc.add(newOption1);
                newOption1.innerText = "Mod103";
            }
            if (uccChecked && (ssccChecked != true)) {
                if (elem == undefined) {
                    /*
                     * var newOption2 = document .createElement('<option
                     * value="Mod10 & Mod103">');
                     */
                    var newOption2 = document.createElement("option");
                    newOption2.value = "Mod10 & Mod103";
                    elemc.add(newOption2);
                    newOption2.innerText = "Mod10 & Mod103";
                }
                $('#dm').val($("#supTypeDMSK").find("option:contains('FNC1')").val());
                // document.getElementById("shmod10").checked = false;
                // document.getElementById("shmod10").disabled = true;

            } else if (!uccChecked) {
                $('#dm').val('');
                // document.getElementById("shmod10").checked = false;
                // document.getElementById("shmod10").disabled = true;

            }
            if (elem != undefined && elem == "Mod10 & Mod103") {
                // document.getElementById("shmod10").disabled = false;
                // document.getElementById("shmod10").checked = false;
                // if (value == 'T') {
                // document.getElementById("shmod10").checked = true;
                // }

            }


        };

        function display() {
            $scope.cdb_tr = true;
            $scope.cdc_tr = true;
            $scope.encoding_tr = false;
            $scope.cell_tr = false;
            $scope.format_tr = false;
            $scope.mode_tr = false;
            $scope.col_tr = false;
            $scope.row_tr = false;
            $scope.correct_tr = false;
            $scope.flag_tr = false;
            try {
                if ($('#Symbologies').val() != 'CODE128') {
                    document.getElementById("shmod10").checked = false;
                    document.getElementById("shmod11").checked = false;
                    document.getElementById("shmod103").checked = false;
                }
                $scope.shmod11_tr = false;
                $scope.shmod10_tr = false;
                $scope.shmod103_tr = false;
            } catch (exp) {}

            document.getElementById("dm_tr").disabled = false;
            $('#cdb').val('No Check Digit');
        }

        function validate() {
            if ($('#Symbologies').val() != 'CODE128') {
                document.getElementById("ucc_ean128_cb").checked = false;
                document.getElementById("sscc_18_cc").checked = false;
            }
            $scope.ucc_ean128_tr = false;
            $scope.sscc_18_tr = false;
            $scope.suplement_tr = false;
            $scope.startStop_tr = false;


        }

        function check_forCODABAR() {
            try {
                $scope.suplement_tr = false;
            } catch (e) {}
            $scope.dm_tr = true;
            $('#supTypeDMSK').hide();
            $('#dmskAdd').hide();

        }

        function check_forCODE128(statusChkSscc) {
            try {
                // alert('');
                // document.getElementById("shmod10_tr").style.display = "block";
                // document.getElementById("shmod103_tr").style.display = "block";
                $scope.ucc_ean128_tr = true;
                $scope.sscc_18_tr = true;
                $scope.suplement_tr = false;
                $scope.startStop_tr = false;
                document.getElementById("ucc_ean128_cb").checked = false;
                document.getElementById("sscc_18_tr").checked = false;
                document.getElementById("sscc_18_cc").disabled = true;

                document.getElementById("suplement").disabled = false;
            } catch (e) {}
            $scope.dm_tr = true;
            $('#supTypeDMSK').show();
            $('#dmskAdd').show();
            document.getElementById("supTypeDMSK").disabled = false;
            document.getElementById("dmskAdd").disabled = false;
        }

        function check_forCODE93() {
            try {
                $scope.suplement_tr = false;
                $scope.startStop_tr = false;
                $scope.dm_tr = true;
                $('#supTypeDMSK').hide();
                $('#dmskAdd').hide();
            } catch (e) {}
        }

        function check_forCODE39() {
            $scope.dm_tr = true;
            $('#supTypeDMSK').hide();
            $('#dmskAdd').hide();
        }

        function check_forINT2OF5() {
            try {
                $scope.suplement_tr = false;
            } catch (e) {}
            $scope.dm_tr = true;
            $('#supTypeDMSK').hide();
            $('#dmskAdd').hide();
        }

        function check_forMSI() {
            try {
                $scope.suplement_tr = false;
                $scope.startStop_tr = false;
            } catch (e) {}
            $scope.dm_tr = true;
            $('#supTypeDMSK').hide();
            $('#dmskAdd').hide();
        }

        function check_forE8() {
            try {
                $scope.suplement_tr = true;
                $scope.startStop_tr = false;
            } catch (e) {}
            $scope.dm_tr = true;
            $('#supTypeDMSK').hide();
            $('#dmskAdd').hide();
        }

        function check_forE13() {
            try {
                $scope.suplement_tr = true;
                $scope.startStop_tr = false;
            } catch (e) {}
            $scope.dm_tr = true;
            $('#supTypeDMSK').hide();
            $('#dmskAdd').hide();
        }

        function check_forUPCA() {
            try {
                $scope.suplement_tr = true;
                $scope.startStop_tr = false;

            } catch (e) {}
            $scope.changeCdb = cdb_onChange_upc;
            $scope.dm_tr = true;
            $('#supTypeDMSK').hide();
            $('#dmskAdd').hide();
        }

        function cdb_onChange_upc() {

        }

        function check_forUPCE() {
            try {
                $scope.suplement_tr = true;
                $scope.startStop_tr = false;

            } catch (e) {}
            $scope.changeCdb = cdb_onChange_upc;
            $scope.dm_tr = true;
            $('#supTypeDMSK').hide();
            $('#dmskAdd').hide();
        }

        function check_forpdf() {
            $scope.cell_tr = false;
            $scope.cdb_tr = false;
            $scope.cdc_tr = false;
            $scope.mode_tr = true;
            $scope.dm_tr = false;
            $scope.col_tr = true;
            $scope.row_tr = true;
            $scope.correct_tr = true;
            $scope.flag_tr = true;
            $scope.encoding_tr = false;
            $scope.cell_tr = false;
            $scope.format_tr = false;
            document.getElementById("flag").checked = false;
            try {
                if (document.getElementById("shmod10") && document.getElementById("shmod10").checked) {
                    document.getElementById("shmod10").checked = false;
                }
                $scope.shmod10_tr = false;
                if (document.getElementById("shmod11") && document.getElementById("shmod11").checked) {
                    document.getElementById("shmod11").checked = false;
                }
                $scope.shmod11_tr = false;
                if (document.getElementById("shmod103") && document.getElementById("shmod103").checked) {
                    document.getElementById("shmod103").checked = false;
                }
                $scope.shmod103_tr = false;

                if (document.getElementById("suplement") && document.getElementById("suplement").checked) {
                    document.getElementById("suplement").checked = false;
                }
                $scope.supplement_tr = false;
                if (document.getElementById("startstop") && document.getElementById("startstop").checked) {
                    document.getElementById("startstop").checked = false;
                }
                $scope.startstop_tr = false;
            } catch (exp) {}
        }

        function check_fordm() {

            try {

                $scope.encoding_tr = true;
                $scope.cell_tr = true;
                $scope.format_tr = true;
                $scope.cdb_tr = false;
                $scope.cdc_tr = false;
                $scope.dm_tr = false;
                $scope.mode_tr = false;
                $scope.col_tr = false;
                $scope.row_tr = false;
                $scope.correct_tr = false;
                $scope.flag_tr = false;
                $scope.startStop_tr = false;
                $scope.shmod103_tr = false;
                $scope.shmod10_tr = false;
                $scope.shmod11_tr = false;
                document.getElementById("cell_size").value = '1';
            } catch (exp) {}

        }

        function disable() {
            if (document.getElementById("cdb").value == 'No Check Digit') {
                document.getElementById("cdc").disabled = true;
                showModChk10Box();
                showModChk11Box();
            } else {
                document.getElementById("cdc").disabled = false;
            }
        }

        function setBarcodeValue(bcelement, bcvalue) {
            chkStatusForBc = true;
            if ($(bcelement).attr("type") == 'checkbox') {
                if (bcvalue == 'T' || bcvalue == 'Y' || bcvalue == true) {
                    $(('#' + $(bcelement).attr('id') + '_tr')).show();
                    $(bcelement).removeAttr('disabled');
                    $(bcelement).prop("checked", true);
                    if ($(bcelement).attr('bckey') == 'ucc' || $(bcelement).attr('bckey') == 'sscc') {
                        $scope.action_OnSsc();
                    }
                }
            } else {
                $(bcelement).val(bcvalue);
            }
        }

        $scope.saveBarcode = function() {
            var innerelements = $("#bc_table :input[bcKey]");
            var supplementCheck = false; // Barcode cache code fix-Data source
            // calculation error-Hau Ryan
            // (ADIM00001460055)
            for (var i = 0; i < innerelements.length; i++) {
                if ($(innerelements[i]).attr("type") == 'checkbox') {
                    if ($(innerelements[i]).attr("bcKey") == 'trunc') {
                        if ($(innerelements[i]).prop("checked") == true) {
                            barcodeProperties[$(innerelements[i]).attr("bcKey")] = true;
                        } else {
                            barcodeProperties[$(innerelements[i]).attr("bcKey")] = false;
                        }
                    } else {
                        barcodeProperties[$(innerelements[i]).attr("bcKey")] = $(innerelements[i]).prop("checked") == true ? 'T' : 'F';
                    }
                } else {
                    barcodeProperties[$(innerelements[i]).attr("bcKey")] = $(innerelements[i]).val();
                    // Barcode cache code fix-Data source calculation error-Hau
                    // Ryan (ADIM00001460055)
                    if ($(innerelements[i]).attr("bcKey") == 'sym') {
                        if ($(innerelements[i]).val() == 'EAN13' || $(innerelements[i]).val() == 'EAN8' || $(innerelements[i]).val() == 'UPCA' || $(innerelements[i]).val() == 'UPCE') {
                            supplementCheck = true;
                        }
                    }
                    if ($(innerelements[i]).attr("bcKey") == 'dMsk') {
                        barcodeProperties['dMsk'] = encodeURI($(innerelements[i]).val());
                    }
                    if (supplementCheck) {
                        if ($(innerelements[i]).attr("bcKey") == 'dCal') {
                            barcodeProperties[$(innerelements[i]).attr("bcKey")] = 'Mod10';
                        } else if ($(innerelements[i]).attr("bcKey") == 'suplement') {
                            if ($(innerelements[i]).val() == null) {
                                barcodeProperties[$(innerelements[i]).attr("bcKey")] = 'None';
                            }
                        }
                    }
                }
            }
            if (barcodeProperties.cols == null || barcodeProperties.cols == "") {
                barcodeProperties.cols = "0";
            }
            if (barcodeProperties.rows == null || barcodeProperties.rows == "") {
                barcodeProperties.rows = "0";
            }
            if (barcodeProperties.corrLev == null || barcodeProperties.corrLev == "") {
                barcodeProperties.corrLev = "0";
            }
            parentScope.currentElements.barPr = barcodeProperties;
            $scope.cancelBarcode();
        };

        function validateBarcodeProperties() {
            switch (barcodeProperties.sym) {
                case 'CODABAR':
                    return validateCodaBar();
                case 'CODE128':
                    return validateCode128();
                case 'CODE39':
                    return validateCode39();
                case 'CODE93':
                    return validateCode93();
                case 'DATAMATRIX':
                    return validateDataMatrix();
                case 'EAN13':
                    return validateEAN13();
                case 'EAN8':
                    return validateEAN8();
                case 'INT2OF5':
                    return validateINT2OF5();
                case 'MSI':
                    return validateMSI();
                case 'PDF417':
                    return validatePDF417();
                case 'UPCA':
                    return validateUPCA();
                case 'UPCE':
                    return validateUPCE();
                default:
                    return true;
            }

        }

        function isJsonEmpty(jsonarr) {
            if (Object.keys(jsonarr).length > 0) {
                return false;
            } else {
                return true;
            }
        }

        function validateCodaBar() {
            return true;
        }

        function validateCode128() {
            if ($("input[bcKey = 'ucc']").prop('checked') &&
                $("input[bcKey = 'sscc']").prop('checked')) {
                var regexpValue = new RegExp(/^\d{18}$/);
                var btxtvalue = $("input[bcKey = 'btxt']").attr('value');
                var ismatch = regexpValue.test(btxtvalue);
                if (!ismatch) {
                    alert('Please enter valid 18 digits number in Barcode Text');
                    return false;
                } else {
                    return true;
                }
            } else
                return true;
        }

        function validateCode39() {
            var regexpValue = new RegExp(/[0-9A-Z\$\%\*\+\.\-\/\_\s]$/);
            var btxtvalue = $("input[bcKey = 'btxt']").attr('value');
            var ismatch = regexpValue.test(btxtvalue);
            if (!ismatch) {
                alert('Please enter only the charecters listed below \n 1. Numeric[0-9] \n 2.Alpha (UpperCase) \n 3.Special Chars [$ % * + . - / _ ]');
                return false;
            } else {
                return true;
            }
        }

        function validateCode93() {
            var regexpValue = new RegExp(/[0-9A-Z\$\%\*\+\.\-\/\_\s]$/);
            var btxtvalue = $("input[bcKey = 'btxt']").attr('value');
            var ismatch = regexpValue.test(btxtvalue);
            if (!ismatch) {
                alert('Please enter only the charecters listed below \n 1. Numeric[0-9] \n 2.Alpha (UpperCase) \n 3.Special Chars [$ % * + . - / _ ]');
                return false;
            } else {
                return true;
            }

        }

        function validateDataMatrix() {
            return true;
        }

        function validateEAN13() {
            var regexpValue = new RegExp(/^\d{13}$/);
            var btxtvalue = $("input[bcKey = 'btxt']").attr('value');
            var ismatch = (btxtvalue.search(regexpValue) == -1) ? false : true;
            if (!ismatch) {
                alert('Please enter valid thirteen number in Barcode Text');
                return false;
            } else {
                return true;
            }
        }

        function validateEAN8() {
            var regexpValue = new RegExp(/^\d{8}$/);
            var btxtvalue = $("input[bcKey = 'btxt']").attr('value');
            var ismatch = regexpValue.test(btxtvalue);
            if (!ismatch) {
                alert('Please enter valid eight digit number in Barcode Text');
                return false;
            } else {
                return true;
            }
        }

        function validateINT2OF5() {
            return true;
        }

        function validateMSI() {
            if ($("select[bcKey = 'dBhv']").val() == 'No Check Digit') {
                var regexpValue = new RegExp(/^\d+$/);
                var btxtvalue = $("input[bcKey = 'btxt']").attr('value');
                var ismatch = regexpValue.test(btxtvalue);
                if (!ismatch) {
                    alert('Barcode input incorrect. Please enter any number of numeric digits only');
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }

        function validatePDF417() {
            return true;
        }

        function validateUPCA() {
            var regexpValue = /^\d{12}$/;
            var btxtvalue = $("input[bcKey = 'btxt']").attr('value');
            var ismatch = regexpValue.test(btxtvalue);
            if (!ismatch) {
                alert('Please enter valid twelve digit number in Barcode Text');
                return false;
            } else {
                return true;
            }
        }

        function validateUPCE() {
            var regexpValue = /^\d{7}$/;
            var btxtvalue = $("input[bcKey = 'btxt']").attr('value');
            var ismatch = regexpValue.test(btxtvalue);
            if (!ismatch) {
                alert('Please enter valid seven digit number in Barcode Text');
                return false;
            } else {
                return true;
            }

        }

        function setValueInBTxt() {}

        $scope.setValueInDMsk = function() {
            // var value= $('#dm').val() == "" ? "" : $('#dm').val() ;
            // $('#dm').val(value + $('#supTypeDMSK').val());
            $('#dm').insertAtCaret($('#supTypeDMSK').val());
        };

        $.fn.extend({
            insertAtCaret: function(myValue) {
                if (document.selection) {
                    this[0].focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                    this[0].focus();
                } else if (this[0].selectionStart || this[0].selectionStart == '0') {
                    var startPos = this[0].selectionStart;
                    var endPos = this[0].selectionEnd;
                    var scrollTop = this[0].scrollTop;
                    this[0].value = this[0].value.substring(0, startPos) + myValue +
                        this[0].value.substring(endPos, this[0].value.length);
                    this[0].focus();
                    this[0].selectionStart = startPos + myValue.length;
                    this[0].selectionEnd = startPos + myValue.length;
                    this[0].scrollTop = scrollTop;
                } else {
                    this[0].value = myValue;
                    this[0].focus();
                }
            }
        });
    };
    // end of BarCode
    //Mask Starts here
    $scope.showMask = function(createEvent, currentMasterAttributes) {
        $scope.selectedFieldObj = currentMasterAttributes;
        var dataToPassChild = { 'scope': $scope, 'selectedObj': currentMasterAttributes };
        $mdDialog.show({
            locals: { dataToPass: dataToPassChild },
            controller: FieldMaskController,
            templateUrl: 'html/dw/layering/Field-Mask.html',
            parent: angular.element(document.body),
            targetEvent: createEvent,
            clickOutsideToClose: false
        }).then(function() {

        }, function(error) {
            console.log(error);
        });
    }

    function FieldMaskController($scope, $mdDialog, dataToPass) {
        var parentScope = dataToPass;
        console.log('11111' + parentScope.scope.datasetDetail.eAr);
        console.log('22222' + parentScope.selectedObj);
        $scope.showDataSetSyncBuildResult = false;
        $scope.enableDataSetSyncBuildButtonFlag = false;
        $scope.hideMask = function() {
            $mdDialog.cancel();

        };

        $scope.selectMaskVal = [];
        $scope.populateDate = function() {
            console.log('----------');
            $scope.selectedMaskVal = '';
            $scope.maskType = 'D';
            $scope.currentItem = "Date";
            $scope.selectMaskVal = ["dd-MMM-yyyy", "MMM-dd-yyyy", "MM/dd"];
        }

        $scope.selectMaskVal = [];
        $scope.populateCurrency = function() {
            $scope.selectedMaskVal = '';
            $scope.maskType = 'R';
            $scope.currentItem = "Currency";
            $scope.selectMaskVal = ["!$(#)>", "!#(#)>", "$##.00", "#,##.##"];
        }
        $scope.populateCustom = function() {
            $scope.selectedMaskVal = '';
            $scope.maskType = 'N';
            $scope.selectMaskVal = [];
            $scope.currentItem = "Custom";
            $scope.selectedMaskVal = '';
        }
        $scope.populateNumber = function() {
            $scope.selectedMaskVal = '';
            $scope.maskType = 'M';
            $scope.currentItem = "Number";
            $scope.selectMaskVal = ["#", "##.00", "##-##-##", "###-###-###"];
        }
        $scope.populateText = function() {
            $scope.selectedMaskVal = '';
            $scope.maskType = 'T';
            $scope.currentItem = "Text";
            $scope.selectMaskVal = ["^", "^^^", "^^ ^^", "^^^ - ^^^"];
        }
        $scope.populateRegExp = function() {
            $scope.selectedMaskVal = '';
            $scope.maskType = 'X';
            $scope.selectMaskVal = [];
            $scope.currentItem = "RegEX";
            $scope.selectedMaskVal = '';
        }

        $scope.setMaskVal = function(val) {
            if (val != undefined && val.length > 0) {
                $scope.selectedMaskVal = val;
            }
        }

        $scope.changeMask = function() {
            if ($scope.maskType != undefined && $scope.maskType != 'C' && $scope.maskType != 'X') {
                alert('You are trying to change a predifined mask. This will create a custom mask.');
                $scope.populateCustom();
            }
        }

        $scope.onLoadMask = function() {
            parentScope.scope.datasetDetail.eAr.forEach(masterattributes => {
                if ((masterattributes != null && masterattributes != undefined) && (masterattributes.sequence == parentScope.selectedObj.sequence)) {

                    $scope.maskType = masterattributes.gridPr.msk.slice(-1);
                    $scope.selectedMaskVal = masterattributes.gridPr.msk.substring(0, masterattributes.gridPr.msk.length - 1)

                }
            });

            if ($scope.maskType != undefined) {
                if ($scope.maskType == 'D') {
                    $scope.selectMaskVal = ["dd-MMM-yyyy", "MMM-dd-yyyy", "MM/dd"];
                    $scope.selectedMaskVal = $scope.selectedMaskVal;
                    $scope.currentItem = "Date";
                } else if ($scope.maskType == 'R') {
                    $scope.selectMaskVal = ["!$(#)>", "!#(#)>", "$##.00", "#,##.##"];
                    $scope.selectedMaskVal = $scope.selectedMaskVal;
                    $scope.currentItem = "Currency";
                } else if ($scope.maskType == 'N') {
                    $scope.selectedMaskVal = '';
                    $scope.selectedMaskVal = $scope.selectedMaskVal;
                    $scope.currentItem = "Custom";
                } else if ($scope.maskType == 'M') {
                    $scope.selectMaskVal = ["#", "##.00", "##-##-##", "###-###-###"];
                    $scope.selectedMaskVal = $scope.selectedMaskVal;
                    $scope.currentItem = "Number";
                } else if ($scope.maskType == 'T') {
                    $scope.selectMaskVal = ["^", "^^^", "^^ ^^", "^^^ - ^^^"];
                    $scope.selectedMaskVal = $scope.selectedMaskVal;
                    $scope.currentItem = "Text";
                } else if ($scope.maskType == 'X') {
                    $scope.selectMaskVal = [];
                    $scope.selectedMaskVal = $scope.selectedMaskVal;
                    $scope.currentItem = "RegEX";
                }
            }
        }

        $scope.onLoadMask();

        $scope.saveMask = function() {
            console.log('11111' + parentScope.scope.datasetDetail.eAr);
            console.log('22222' + parentScope.selectedObj);
            parentScope.scope.datasetDetail.eAr.forEach(masterattributes => {
                if ((masterattributes != null && masterattributes != undefined) && (masterattributes.sequence == parentScope.selectedObj.sequence)) {
                    masterattributes.gridPr.msk = $scope.selectedMaskVal + $scope.maskType;
                    // masterattributes.customMaskFlag = $scope.maskType;
                }
            });
            $scope.hideMask();
            console.log('Obj Updated :' + JSON.stringify(parentScope.scope.datasetDetail.eAr));
        }
    }

    //Mask Ends here
    // Properties code starts here
    $scope.showFiledProperties = function(currentMasterAttributes) {
        localStoreService.store("datasetDetails", $scope.datasetDetail);
        var dataToPassChild = { 'scope': $scope, 'currentMasterAttributes': currentMasterAttributes };
        $mdDialog.show({
            locals: { dataToPass: dataToPassChild },
            controller: FieldPropertiesController,
            templateUrl: 'html/dw/evdp/DatsourceFieldProperties.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        }).then(function() {

        }, function(error) {
            console.log(error);
        });
    }

    function FieldPropertiesController($scope, $mdDialog, dataToPass) {
        $scope.cancel = $mdDialog.cancel;
        $scope.hide = $mdDialog.hide;
        // $scope.disableAddList = false;
        var parentScope = dataToPass.scope;;
        var currentMasterAttributes = dataToPass.currentMasterAttributes;
        var rbcId = parentScope.RBCCode;
        //var rbcId = 1;
        $scope.selectedattribute = currentMasterAttributes;
        $scope.propertiesList = [];
        $scope.propertyValues = [];
        $scope.currentPropertyId = null;
        $scope.currentProperty = null;
        $scope.noOfLinkedFieldsList = [0];
        $scope.keyFieldsList = [];
        $scope.noOfMaximumSelectionsList = [0];

        $scope.lockedFlag = false;
        $scope.progressiveSearchFlag = false;
        $scope.noOfLinkedFields = "0";
        $scope.multiSelectFlag = false;
        $scope.noOfMaximumSelections = "0";

        var constkeyFiledsList = ['Avery Item ID', 'Customer Item ID', 'Customer Name/ID'];
        var getAllProperties = function() {
            $scope.loadingLists = true;
            if (currentMasterAttributes.gridPr.typ == 'Image List') {
                MasterAttributesService.getImageListProperties(rbcId)
                    .then(function successCallback(response) {
                        if (response.code == "Error") {
                            $rootScope.openToast(response.text, 0, "manualClose");
                        } else {
                            $scope.propertiesList = angular.fromJson(response.responseData);
                        }
                        if (currentMasterAttributes.popPr != undefined && currentMasterAttributes.popPr != null) {
                            onLoadFunction();
                        }

                        $scope.loadingLists = false;

                    }, function errorCallback(response) {
                        $rootScope.openToast("Properties loading failed", 0, "manualClose");
                    });
            } else if (currentMasterAttributes.gridPr.typ == 'List Box' || currentMasterAttributes.gridPr.typ == 'Lookup') {
                MasterAttributesService.getListBoxProperties(rbcId)
                    .then(function successCallback(response) {
                        if (response.code == "Error") {
                            $rootScope.openToast(response.text, 0, "manualClose");
                        } else {
                            $scope.propertiesList = angular.fromJson(response.responseData);
                        }
                        if (currentMasterAttributes.popPr != undefined && currentMasterAttributes.popPr != null) {
                            onLoadFunction();
                        }
                        $scope.loadingLists = false;
                    }, function errorCallback(response) {
                        $rootScope.openToast("Properties loading failed", 0, "manualClose");
                    });
            }
        }

        // get ListBox Values by using versionId 
        var getPropertyValueByVersionId = function(versionId) {
            $scope.loadingValues = true;
            if (currentMasterAttributes.gridPr.typ == 'Image List') {
                MasterAttributesService.getImageListValues(versionId)
                    .then(function successCallback(response) {
                        $scope.propertyValues = angular.fromJson(response.responseData);
                        $scope.loadingValues = false;
                        if ($scope.currentProperty.nOfKeys && $scope.propertyValues.lValues && $scope.propertyValues.lValues.length >= 2) {
                            $scope.noOfMaximumSelectionsList = $scope.noOfMaximumSelectionsList.concat(Array.from({ length: $scope.propertyValues.lValues.length }, (v, k) => k + 1))
                        }
                    }, function errorCallback(response) {
                        $rootScope.openToast("Properties value loading failed", 0, "manualClose");
                    });
            } else if (currentMasterAttributes.gridPr.typ == 'List Box' || currentMasterAttributes.gridPr.typ == 'Lookup') {
                MasterAttributesService.getListBoxValues(versionId)
                    .then(function successCallback(response) {
                        $scope.propertyValues = angular.fromJson(response.responseData);
                        $scope.loadingValues = false;
                        if ($scope.currentProperty.nOfKeys && $scope.propertyValues.lValues && $scope.propertyValues.lValues.length >= 2) {
                            $scope.noOfMaximumSelectionsList = $scope.noOfMaximumSelectionsList.concat(Array.from({ length: $scope.propertyValues.lValues.length }, (v, k) => k + 1))
                        }
                    }, function errorCallback(response) {
                        $rootScope.openToast("Properties value loading failed", 0, "manualClose");
                    });
            }
        }

        var onLoadFunction = function() {
            if (Object.keys(currentMasterAttributes.popPr).length > 0) {
                $scope.currentProperty = currentMasterAttributes.popPr;
                $scope.currentPropertyId = currentMasterAttributes.popPr.lId;
                $scope.description = currentMasterAttributes.popPr.lNm;
                $scope.lockedFlag = Boolean(currentMasterAttributes.popPr.lock);
                $scope.progressiveSearchFlag = Boolean(currentMasterAttributes.popPr.pSearch);
                $scope.key1 = currentMasterAttributes.popPr.key1;
                $scope.key2 = currentMasterAttributes.popPr.key2;
                $scope.key3 = currentMasterAttributes.popPr.key3;
                $scope.key4 = currentMasterAttributes.popPr.key4;
                $scope.key5 = currentMasterAttributes.popPr.key5;
                $scope.multiSelectFlag = Boolean(currentMasterAttributes.popPr.multiSel);
                $scope.noOfMaximumSelections = currentMasterAttributes.popPr.mxSel;
                if (currentMasterAttributes.gridPr.typ == 'Image List') {
                    $scope.imageDisplayType = currentMasterAttributes.popPr.imageDispTyp;
                    $scope.imageDisplayPosition = currentMasterAttributes.popPr.imagePos;
                    $scope.imageHeight = currentMasterAttributes.popPr.imgHeight;
                    $scope.imageWidth = currentMasterAttributes.popPr.imgWidth;
                    $scope.includeAllImagesFlag = currentMasterAttributes.popPr.includeAll;
                }
                //$scope.noOfMaximumSelections = currentMasterAttributes.popPr.noOfMaximumSelections;
                versionId = currentMasterAttributes.popPr.lId;
                if ($scope.currentPropertyId && versionId) {
                    angular.forEach($scope.propertiesList, function(prop) {
                        if (prop.vid == versionId) {
                            $scope.currentProperty = prop;
                            $scope.description = $scope.currentProperty.desc;
                            if ($scope.currentProperty.nOfKeys) {
                                $scope.noOfLinkedFieldsList.concat(Array.from({ length: $scope.currentProperty.nOfKeys }, (v, k) => k + 1));
                                var tempKeyFieldList = []
                                parentScope.datasetDetail.eAr.forEach(masterattribute => tempKeyFieldList.push(masterattribute.gridPr.eNm))
                                tempKeyFieldList.concat(constkeyFiledsList);
                                $scope.keyFieldsList = tempKeyFieldList;
                            }
                        }
                    });
                    getPropertyValueByVersionId(versionId);
                }
            }

        }

        getAllProperties();

        $scope.getPropertyValue = function(property) {
            $scope.currentProperty = property;
            // $scope.disableAddList = true;
            var versionId = property.vid;
            $scope.description = $scope.currentProperty.desc;
            if ($scope.currentProperty.nOfKeys) {
                $scope.noOfLinkedFieldsList.concat(Array.from({ length: $scope.currentProperty.nOfKeys }, (v, k) => k + 1));
                var tempKeyFieldList = []
                parentScope.datasetDetail.eAr.forEach(masterattribute => tempKeyFieldList.push(masterattribute.gridPr.eNm))
                tempKeyFieldList.concat(constkeyFiledsList);
                $scope.keyFieldsList = tempKeyFieldList;
            }
            getPropertyValueByVersionId(versionId);
            // generate maxSelection List


        }

        $scope.saveFieldProperties = function() {
            if (currentMasterAttributes.gridPr.typ == 'List Box' || currentMasterAttributes.gridPr.typ == 'Image List') {
                fieldPropertiesVO = {
                    //lId: $scope.currentProperty.id,
                    lNm: $scope.currentProperty.name,
                    lId: $scope.currentProperty.vid,
                    cId: rbcId,
                    //description: $scope.currentProperty.desc,
                    lock: $scope.lockedFlag,
                    pSearch: $scope.progressiveSearchFlag,
                    lnkFlds: $scope.noOfLinkedFields,
                    key1: $scope.key1,
                    key2: $scope.key2,
                    key3: $scope.key3,
                    key4: $scope.key4,
                    key5: $scope.key5,
                    multiSel: $scope.multiSelectFlag,
                    mxSel: $scope.noOfMaximumSelections
                        //noOfMaximumSelections: $scope.performRangeMatchingFlag
                }
            } else if (currentMasterAttributes.gridPr.typ == 'Lookup') {
                fieldPropertiesVO = {
                    cId: rbcId,
                    lId: $scope.currentProperty.vid,
                    lNm: $scope.currentProperty.name
                }
            } else if (currentMasterAttributes.gridPr.typ == 'Image List') {
                fieldPropertiesVO = {
                    lNm: $scope.currentProperty.name,
                    lId: $scope.currentProperty.vid,
                    lock: $scope.lockedFlag,
                    key1: $scope.key1,
                    key2: $scope.key2,
                    key3: $scope.key3,
                    key4: $scope.key4,
                    key5: $scope.key5,
                    pSearch: $scope.progressiveSearchFlag,
                    imageDispTyp: $scope.imageDisplayType,
                    imagePos: $scope.imageDisplayPosition,
                    imgHeight: $scope.imageHeight,
                    imgWidth: $scope.imageWidth,
                    includeAll: $scope.includeAllImagesFlag
                }
            }
            if (currentMasterAttributes.popPr == undefined || currentMasterAttributes.popPr == null) {
                currentMasterAttributes["popPr"] = {};
            }
            currentMasterAttributes.popPr = fieldPropertiesVO;
            $scope.hide();
        }

        $scope.open = function(location) {
            $scope.hide();
            if($scope.currentProperty!=null){
            fieldPropertiesVO = {
                //lId: $scope.currentProperty.id,
                lNm: $scope.currentProperty.vid,
                lId: $scope.currentProperty.id,
                cId: rbcId,
                description: $scope.description,
                lock: $scope.lockedFlag,
                pSearch: $scope.progressiveSearchFlag,
                lnkFlds: $scope.noOfLinkedFields,
                key1: $scope.key1,
                key2: $scope.key2,
                key3: $scope.key3,
                key4: $scope.key4,
                key5: $scope.key5,
                multiSel: $scope.multiSelectFlag,
                mxSel: $scope.noOfMaximumSelections,
                //noOfMaximumSelections: $scope.performRangeMatchingFlag
            }
            currentMasterAttributes.popPr = fieldPropertiesVO;
            localStoreService.store("addListPopupData", currentMasterAttributes);
        }
            
            $location.path(location);
        }


    }
    var counter = 0;
    var Editcounter = 0;
    var EditApiCounter = 0;
    var SaveApicounter = 0;
    var holdVNo = "";
    //Am holding versionID for newly create DataSource and existing view mode
    var details = localStoreService.get('editdatasetdetails');
    var version_id = ""; //common now

    //This is for display oreder mode delete
    var deleteDOM = function(displynames) {
            $scope.disOrModeData = $rootScope.PopUpdata; //check this point
            $scope.datasetDetaildata = $rootScope.datasetDetail;
            var dispMode = displynames;
            if (SaveViewUpdateDeleteGlobal != "" && SaveViewUpdateDeleteGlobal != undefined) {
                if (ViewFlag == true && ViewSaveCounter <= 0) {
                    dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                    updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                    version_id = SaveViewUpdateDeleteGlobal.dsVid;
                    ViewSaveCounter++;
                } else if (SaveFlag = true && ViewSaveCounter <= 0) {
                    dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                    updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                    version_id = SaveViewUpdateDeleteGlobal.dsVid;
                    //ViewSaveCounter++;

                } else {
                    //save api called
                    if (SaveViewUpdateDeleteGlobal.dVerNo != undefined) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                        updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                        version_id = SaveViewUpdateDeleteGlobal.dsVid;
                    }
                    //other reponse
                    else if (SaveViewUpdateDeleteGlobal.dsVerNo != undefined) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dsVerNo
                        updateTranId = SaveViewUpdateDeleteGlobal.updTranId;
                        version_id = VersionGlobal;
                    }

                }
            }
            var action = "Delete"
            if (dispMode == "Legacy") {
                dispMode = "legacy"
            }
            if (dispMode == "Customer Docs") {
                dispMode = "customerdocs"
            }
            if (dispMode == "Sku Reference") {
                dispMode = "skureference"
            }
            if (dispMode == "Callout") {
                dispMode = "callout"
            }
            if (dispMode == "Manual") {
                dispMode = "standard";
            }
            $scope.deleteData = { "dsVersionId": version_id, "updateTranId": updateTranId, "displayMode": dispMode }
            DatasetService.deleteOrderMode($scope.deleteData).then(function(response) {
                $rootScope.deleteResponse = response;
                SaveViewUpdateDeleteGlobal = response;
                DeleteDataResponse = response;
                holdVNo = $rootScope.deleteResponse.dsVerNo;
                flagCreate = false;
                // Thsi is for enable and disable button
                if (displynames == "Manual") {
                    cnt.createstd = true;
                    cnt.editstd = false;
                    cnt.viewstd = false;
                    cnt.deletestd = false;
                } else if (displynames == "Callout") {
                    cnt.createcall = true;
                    cnt.editcall = false;
                    cnt.viewcall = false;
                    cnt.deletecall = false;
                } else if (displynames == "Legacy") {
                    cnt.createlegy = true;
                    cnt.editlegy = false;
                    cnt.viewlegy = false;
                    cnt.deletelegy = false;
                } else if (displynames == "Customer Docs") {
                    cnt.createcustdocs = true;
                    cnt.editcustdocs = false;
                    cnt.viewcustdocs = false;
                    cnt.deletecust = false;
                } else if (displynames == "Sku Reference") {
                    cnt.createskurefer = true;
                    cnt.editskurefer = false;
                    cnt.viewskurefer = false;
                    cnt.deleteskurefer = false;
                } else {}
            });

        }
        $scope.showConfirm = function (displynames) {
            console.log("call1");
            $scope.confirmMsg="Do you want to delete ?";
            $mdDialog.show({
                controller:ConfirmController,
                templateUrl: 'html/dw/evdp/DomdeleteConfirm.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: {parentScope: $scope, displynames}
            })
                .then(function () {
                }, function () {
                });
        }
        function ConfirmController($scope, $mdDialog, parentScope,displynames) {
            $scope.headerMsg = "Display order mode";
            $scope.confirmMsg=parentScope.confirmMsg;
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.ok = function () {
                $mdDialog.hide();
                deleteDOM(displynames);
                $window.scrollTo(0, 0);
            };
        }
        // Properties code Ends here


    $scope.CustomerName = localStoreService.get("getAllGlidDetailsList.rboName")
    var details = localStoreService.get('editdatasetdetails');
    // start here
    $scope.orderData = { "Manual": "Manual", "Callout": "Callout", "Legacy": "Legacy" };
    $scope.displayMethods = { "Create": "Create", "Edit": "Edit", "View": "View", "Delete": "Delete" };
    $scope.CustomerDocs = "Customer Docs";
    $scope.SkuReference = "Sku Reference";
    $scope.CreateDOM = function(createEvent, orderData, displayMode) {
        $scope.orderTypeMode = orderData;
        $scope.displayMode = displayMode;
        createEvent.currentTarget.value
        $mdDialog.show({
            controller: CreateEditDatasourceDOM,
            templateUrl: 'html/dw/evdp/Care_DisplayOrderPopup.html',
            parent: angular.element(document.body),
            targetEvent: createEvent,
            clickOutsideToClose: false,
            items1: $scope.orderTypeMode,
            items2: $scope.displayMode,
        }).then(function() {}, function() {
            $scope.status = 'Failed to cancel';
        });
    }
    $scope.selectedRow = null;
    function CreateEditDatasourceDOM($scope, $mdDialog, items1, items2, dataTransferService) {
        $scope.disOrModeData = cnt.saveDataSource;
        if (cnt.ViewDataSourceDom != undefined) {
            $scope.dataDescrption = cnt.ViewDataSourceDom.dDsc;
            $scope.dataSourceName = cnt.ViewDataSourceDom.dNm;
        } else if (SaveDatasourceDescription != undefined && SaveDatasourceDescription != "") {
            $scope.dataDescrption = SaveDatasourceDescription.dDsc;
            $scope.dataSourceName = SaveDatasourceDescription.dNm;
        }
        $scope.datasetDetaildata = $rootScope.datasetDetail;
        $scope.CustomerName = localStoreService.get("getAllGlidDetailsList.rboName")
        var details = localStoreService.get('editdatasetdetails');
        $scope.disObjVal = [];
        $scope.orderTypeMode = items1; //check this
        $scope.displayMode = items2;
        if ($scope.displayMode == "View") {
            $scope.HideUpdateButton = true;
        }
        $scope.orderTypeMode = "Manual";

        var timeStamp = "1566975837782";

        var modeObjManual = [];
        var modeObjCallout = [];
        var modeObjLegacy = [];
        var modeObjCust = [];
        var modeObjSku = [];
        var listDataName;
        var listDataId;

        var EditCheck;
        var HeaderCheck;
        var HiddenCheck;

        var manualObj, callOutObj, legacyObj, custObj, skuObj, firstLoad = true;
        var modeObjManualRight = [];
        var modeObjCalloutRight = [];
        var modeObjLegacyRight = [];
        var modeObjCustRight = [];
        var modeObjSkuRight = [];
        var ManLeftLength
        var ManRightLength
        var CalLeftLength
        var CalRightLength
        var LegLeftLength
        var LegRightLength
        var CustLeftLength
        var custRightLength
        var SkuLeftLength
        var SkuRightLength
        var ViewData;
        if (CreateDataResponse != undefined) {
            if (CreateDataResponse.dsVerNo == holdVNo) {
                ViewData = CreateDataResponse;
            } else if (DeleteDataResponse != undefined) {
                if (DeleteDataResponse.dsVerNo == holdVNo) {
                    ViewData = DeleteDataResponse;
                }
            }
        }
        //function to register the drag and drop functionality
        _initializeComponent = function() {
            var src, dest;
            $("#sortable1,#sortable2").sortable({
                connectWith: ".connectedSortable",
                start: function(event, ui) {},
                activate: function(event, ui) {
                    src = ui.sender[0].id;
                },
                stop: function(event, ui) {
                    $(".firstCol li").removeClass('highLightSelected');
                    $(".thirdCol li").removeClass('highLightSelected');

                    var droppedItem = ui.item;
                    var content = droppedItem.html();
                    var addingCheckboxes = `<span class="selectors" style="float-right">
						<input type="checkbox" style="padding: 0 2em;">
						<input type="checkbox" style="padding: 0 2em;">
						<input type="checkbox" style="padding: 0 2em;">
					</span>`;
                    dest = droppedItem.parent()[0].id;
                    var dropDownVal = $("#orderTypeDropDown").val();
                    if (src === "sortable1" && dest === "sortable2") {
                        if (droppedItem.find("selectors").length === 0)
                            content = content + addingCheckboxes;
                        droppedItem.html(content);
                        switch (dropDownVal) {
                            case 'Manual':
                                var result = manualObj.left.findIndex(x => x.id === droppedItem[0].id);
                                var removed = manualObj.left.splice(result, 1);
                                manualObj.right.push(removed[0]);
                                $scope.orderListItems.left=manualObj.left;
                                $scope.orderListItems.right=manualObj.right;
                                break;
                            case 'Callout':
                                var result = callOutObj.left.findIndex(x => x.id === droppedItem[0].id);
                                var removed = callOutObj.left.splice(result, 1);
                                callOutObj.right.push(removed[0]);
                                break;
                            case 'Legacy':
                                var result = legacyObj.left.findIndex(x => x.id === droppedItem[0].id);
                                var removed = legacyObj.left.splice(result, 1);
                                legacyObj.right.push(removed[0]);
                                break;
                            case 'Customer Docs':
                                var result = custObj.left.findIndex(x => x.id === droppedItem[0].id);
                                var removed = custObj.left.splice(result, 1);
                                custObj.right.push(removed[0]);
                                break;
                            case 'Sku Reference':
                                var result = skuObj.left.findIndex(x => x.id === droppedItem[0].id);
                                var removed = skuObj.left.splice(result, 1);
                                skuObj.right.push(removed[0]);
                                break;
                            default:
                                break;
                        }
                    }
                     else if (src === "sortable2" && dest === "sortable1") {
                        droppedItem.find(".selectors").remove();
                        switch (dropDownVal) {
                            case 'Manual':
                                var result = manualObj.right.findIndex(x => x.id === droppedItem[0].id);
                                var removed = manualObj.right.splice(result, 1)
                               manualObj.left.push(removed[0]);
                                break;
                            case 'Callout':
                                var result = callOutObj.right.findIndex(x => x.id === droppedItem[0].id);
                                var removed = callOutObj.right.splice(result, 1);
                                callOutObj.left.push(removed[0]);
                                break;
                            case 'Legacy':
                                var result = legacyObj.right.findIndex(x => x.id === droppedItem[0].id);
                                var removed = legacyObj.right.splice(result, 1);
                                legacyObj.left.push(removed[0]);
                                break;
                            case 'Customer Docs':
                                var result = custObj.right.findIndex(x => x.id === droppedItem[0].id);
                                var removed = custObj.right.splice(result, 1);
                                custObj.left.push(removed[0]);
                                break;
                            case 'Sku Reference':
                                var result = skuObj.right.findIndex(x => x.id === droppedItem[0].id);
                                var removed = skuObj.right.splice(result, 1);
                                skuObj.left.push(removed[0]);
                                break;
                            default:
                                break;
                        }
                    }
                }
                
            }).disableSelection();
            
        }
        
        //$scope.orderTypeMode = "Manual";
        $scope.orderTypeMode = items1;
        $scope.orderListItems = [];
        _getALLValService = function() {
            flagCreate = true;
            //Edit mode viewDataSource Api
            if (cnt.ViewDataSourceDom != undefined) {
                var ViewDataSourceDomLength = cnt.ViewDataSourceDom.eAr.length;
                $scope.saveDescription = cnt.ViewDataSourceDom.dDsc;
                var viewManLength = cnt.ViewDataSourceDom.eAr.length;
                for (var i = 0; i < viewManLength; i++) {
                    listDataName = cnt.ViewDataSourceDom.eAr[i].gridPr.eNm;
                    listDataId = cnt.ViewDataSourceDom.eAr[i].eId;
                    modeObjManual.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                    modeObjCallout.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                    modeObjLegacy.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                    modeObjCust.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                    modeObjSku.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                }
                
                if (SaveViewUpdateDeleteGlobal != "" && SaveViewUpdateDeleteGlobal != undefined) {
                    if (ViewFlag == true && ViewSaveCounter <= 0) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                        updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                        version_id = SaveViewUpdateDeleteGlobal.dsVid;
                        ViewSaveCounter++;
                    } else if (SaveFlag = true && ViewSaveCounter <= 0) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                        updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                        version_id = SaveViewUpdateDeleteGlobal.dsVid;
                        //ViewSaveCounter++;
    
                    } else {
                        if (SaveViewUpdateDeleteGlobal.dVerNo != undefined) {
                            dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                            updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                            version_id = SaveViewUpdateDeleteGlobal.dsVid;
                        }
                        //other reponse
                        else if (SaveViewUpdateDeleteGlobal.dsVerNo != undefined) {
                            dsVerNo = SaveViewUpdateDeleteGlobal.dsVerNo
                            updateTranId = SaveViewUpdateDeleteGlobal.updTranId;
                            version_id = VersionGlobal;
                        }
                    }
                }
                DatasetService.viewOrderMode(version_id, dsVerNo, updateTranId, timeStamp).then(function(response) {
                    SaveViewUpdateDeleteGlobal=response;
                    console.log("called here perfect",SaveViewUpdateDeleteGlobal);
                if (SaveViewUpdateDeleteGlobal != undefined && SaveViewUpdateDeleteGlobal != "") {

                    if (SaveViewUpdateDeleteGlobal.standard != undefined) {
                        ManRightLength = SaveViewUpdateDeleteGlobal.standard.length;
                        for (var i = 0; i < ManRightLength; i++) {
                            for (var j = 0; j < ViewDataSourceDomLength; j++) {
                                var ManRightID = SaveViewUpdateDeleteGlobal.standard[i].eId;
                                if (ManRightID == cnt.ViewDataSourceDom.eAr[j].eId) {
                                    listDataName = cnt.ViewDataSourceDom.eAr[j].gridPr.eNm;
                                    listDataId = cnt.ViewDataSourceDom.eAr[j].eId;
                                    EditCheck = SaveViewUpdateDeleteGlobal.standard[i].ed;
                                    HeaderCheck = SaveViewUpdateDeleteGlobal.standard[i].hdr;
                                    HiddenCheck = SaveViewUpdateDeleteGlobal.standard[i].det;
                                }
                            }
                            modeObjManualRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });

                        }
                    }
                    if (SaveViewUpdateDeleteGlobal.callout != undefined) {
                        CalRightLength = SaveViewUpdateDeleteGlobal.callout.length;

                        for (var i = 0; i < CalRightLength; i++) {
                            for (var j = 0; j < ViewDataSourceDomLength; j++) {
                                var CalRightID = SaveViewUpdateDeleteGlobal.callout[i].eId;
                                if (CalRightID == cnt.ViewDataSourceDom.eAr[j].eId) {
                                    listDataName = cnt.ViewDataSourceDom.eAr[j].gridPr.eNm;
                                    listDataId = cnt.ViewDataSourceDom.eAr[j].eId;
                                    EditCheck = SaveViewUpdateDeleteGlobal.callout[i].ed;
                                    HeaderCheck = SaveViewUpdateDeleteGlobal.callout[i].hdr;
                                    HiddenCheck = SaveViewUpdateDeleteGlobal.callout[i].det;
                                }
                            }
                            modeObjCalloutRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                        }
                    }
                    //legacy
                    if (SaveViewUpdateDeleteGlobal.legacy != undefined) {
                        LegRightLength = SaveViewUpdateDeleteGlobal.legacy.length;

                        for (var i = 0; i < LegRightLength; i++) {
                            for (var j = 0; j < ViewDataSourceDomLength; j++) {
                                var LegRightID = SaveViewUpdateDeleteGlobal.legacy[i].eId;
                                if (LegRightID == cnt.ViewDataSourceDom.eAr[j].eId) {
                                    listDataName = cnt.ViewDataSourceDom.eAr[j].gridPr.eNm;
                                    listDataId = cnt.ViewDataSourceDom.eAr[j].eId;
                                    EditCheck = SaveViewUpdateDeleteGlobal.legacy[i].ed;
                                    HeaderCheck = SaveViewUpdateDeleteGlobal.legacy[i].hdr;
                                    HiddenCheck = SaveViewUpdateDeleteGlobal.legacy[i].det;
                                }
                            }
                            modeObjLegacyRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                        }
                    }
                    //customer docs
                    if (SaveViewUpdateDeleteGlobal.customerdocs != undefined) {
                        custRightLength = SaveViewUpdateDeleteGlobal.customerdocs.length;

                        for (var i = 0; i < custRightLength; i++) {
                            for (var j = 0; j < ViewDataSourceDomLength; j++) {
                                var CustRightID = SaveViewUpdateDeleteGlobal.customerdocs[i].eId;
                                if (CustRightID == cnt.ViewDataSourceDom.eAr[j].eId) {
                                    listDataName = cnt.ViewDataSourceDom.eAr[j].gridPr.eNm;
                                    listDataId = cnt.ViewDataSourceDom.eAr[j].eId;
                                    EditCheck = SaveViewUpdateDeleteGlobal.customerdocs[i].ed;
                                    HeaderCheck = SaveViewUpdateDeleteGlobal.customerdocs[i].hdr;
                                    HiddenCheck = SaveViewUpdateDeleteGlobal.customerdocs[i].det;
                                }
                            }
                            modeObjCustRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                        }
                    }
                    //Sku reference
                    if (SaveViewUpdateDeleteGlobal.skureference != undefined) {
                        SkuRightLength = SaveViewUpdateDeleteGlobal.skureference.length;

                        for (var i = 0; i < SkuRightLength; i++) {
                            for (var j = 0; j < ViewDataSourceDomLength; j++) {
                                var SkuLeftID = SaveViewUpdateDeleteGlobal.skureference[i].eId;
                                if (SkuLeftID == cnt.ViewDataSourceDom.eAr[j].eId) {
                                    listDataName = cnt.ViewDataSourceDom.eAr[j].gridPr.eNm;
                                    listDataId = cnt.ViewDataSourceDom.eAr[j].eId;
                                    EditCheck = SaveViewUpdateDeleteGlobal.skureference[i].ed;
                                    HeaderCheck = SaveViewUpdateDeleteGlobal.skureference[i].hdr;
                                    HiddenCheck = SaveViewUpdateDeleteGlobal.skureference[i].det;
                                }
                            }
                            modeObjSkuRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                        }
                        
                    }
              
               
                }
            });
                console.log("ViewDatasource inside");
                // This is for removing common elements from right to left

                manualObj = {
                    "left": modeObjManual,
                    "right": modeObjManualRight
                }
                callOutObj = {
                    "left": modeObjCallout,
                    "right": modeObjCalloutRight
                }
                legacyObj = {
                    "left": modeObjLegacy,
                    "right": modeObjLegacyRight
                }
                custObj = {
                    "left": modeObjCust,
                    "right": modeObjCustRight
                }
                skuObj = {
                    "left": modeObjSku,
                    "right": modeObjSkuRight
                }
                if (manualObj != undefined && manualObj.left.length >=1 && manualObj.right.length >=1) {
                    for (var i = 0; i < manualObj.right.length;) {
                        if(manualObj.left[i]!=undefined && manualObj.right[i]!=undefined){
                        if (manualObj.left[i].id == manualObj.right[i].id) {
                            manualObj.left.splice(i, 1);
                        } else {
                            if(manualObj.left[i]!=undefined && manualObj.right[i]!=undefined){
                            i++;
                        }
                        }
                    }else{
                        i++;
                    }
                    }
                }
                if (callOutObj != undefined && callOutObj.left.length >=1 && callOutObj.right.length >=1) {
                    for (var i = 0; i < callOutObj.right.length;) {
                        if(callOutObj.left[i]!=undefined && callOutObj.right[i]!=undefined){
                        if (callOutObj.left[i].id == callOutObj.right[i].id) {
                            callOutObj.left.splice(i, 1);
                        } else {
                            if(callOutObj.left[i]!=undefined && callOutObj.right[i]!=undefined){
                            i++;
                        }
                    }
                    }else{
                        i++;
                    }
                }
                }
                if (legacyObj != undefined && legacyObj.left.length >=1 && legacyObj.right.length >=1) {
                    for (var i = 0; i < legacyObj.right.length;) {
                        if(legacyObj.left[i]!=undefined && legacyObj.right[i]!=undefined){
                        if (legacyObj.left[i].id == legacyObj.right[i].id) {
                            legacyObj.left.splice(i, 1);
                        } else {
                            if(legacyObj.left[i]!=undefined && legacyObj.right[i]!=undefined){
                            i++;
                        }
                    }
                    }else{
                        i++;
                    }
                }
                }
                if (custObj != undefined && custObj.left.length >=1 && custObj.right.length >=1) {
                    for (var i = 0; i < custObj.right.length;) {
                        if(custObj.left[i]!=undefined && custObj.right[i]!=undefined){
                        if (custObj.left[i].id == custObj.right[i].id) {
                            custObj.left.splice(i, 1);
                        } else {
                            if(custObj.left[i]!=undefined && custObj.right[i]!=undefined){
                            i++;
                        }
                    }
                    }else{
                        i++;
                    }
                }
                }
                if (skuObj != undefined && skuObj.left.length >=1 && skuObj.right.length >=1) {
                    for (var i = 0; i < skuObj.right.length;) {
                        if(skuObj.left[i]!=undefined && skuObj.right[i]!=undefined){
                        if (skuObj.left[i].id == skuObj.right[i].id) {
                            skuObj.left.splice(i, 1);
                        } else {
                            if(skuObj.left[i]!=undefined && skuObj.right[i]!=undefined){
                            i++;
                        }
                    }
                    }else{
                        i++; 
                    }
                }
                }
                
                console.log("skuObj********", skuObj);
            } else {
                //Create mode Save api 
                console.log("called here inside create dummy ticket");
                if (UpdateResponse == undefined || UpdateResponse == "") {
                    var loopcount = $scope.disOrModeData.eAr.length;
                    for (var i = 0; i < loopcount; i++) {
                        listDataName = $scope.disOrModeData.eAr[i].gridPr.eNm;
                        listDataId = $scope.disOrModeData.eAr[i].eId;
                        modeObjManual.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                        modeObjCallout.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                        modeObjLegacy.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                        modeObjCust.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                        modeObjSku.push({ "itemText": listDataName, "id": listDataId, "Editable": false, "Header": false, "Hidden": false });
                    }
                    manualObj = {
                        "left": modeObjManual,
                        "right": []
                    }
                    callOutObj = {
                        "left": modeObjCallout,
                        "right": []
                    }
                    legacyObj = {
                        "left": modeObjLegacy,
                        "right": []
                    }
                    custObj = {
                        "left": modeObjCust,
                        "right": []
                    }
                    skuObj = {
                        "left": modeObjSku,
                        "right": []
                    }
                } else {
                    // code flow flow for create data source
                    if (SaveViewUpdateDeleteGlobal != "" && SaveViewUpdateDeleteGlobal != undefined) {
                        if (ViewFlag == true && ViewSaveCounter <= 0) {
                            dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                            updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                            version_id = SaveViewUpdateDeleteGlobal.dsVid;
                            ViewSaveCounter++;
                        } else if (SaveFlag = true && ViewSaveCounter <= 0) {
                            dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                            updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                            version_id = SaveViewUpdateDeleteGlobal.dsVid;
                            //ViewSaveCounter++;
        
                        } else {
                            if (SaveViewUpdateDeleteGlobal.dVerNo != undefined) {
                                dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                                updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                                version_id = SaveViewUpdateDeleteGlobal.dsVid;
                            }
                            //other reponse
                            else if (SaveViewUpdateDeleteGlobal.dsVerNo != undefined) {
                                dsVerNo = SaveViewUpdateDeleteGlobal.dsVerNo
                                updateTranId = SaveViewUpdateDeleteGlobal.updTranId;
                                version_id = VersionGlobal;
                            }
                        }
                    }
                    DatasetService.viewOrderMode(version_id, dsVerNo, updateTranId, timeStamp).then(function(response) {
                        SaveViewUpdateDeleteGlobal=response;
                        console.log("called here perfect",SaveViewUpdateDeleteGlobal);

                    if (SaveViewUpdateDeleteGlobal != undefined && SaveViewUpdateDeleteGlobal != "") {
                        if (SaveViewUpdateDeleteGlobal.standard_list != undefined && SaveViewUpdateDeleteGlobal.standard_list.length > 0) {
                            var standard_listCount = SaveViewUpdateDeleteGlobal.standard_list.length;
                            for (var i = 0; i < standard_listCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.standard_list[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.standard_list[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.standard_list[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.standard_list[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.standard_list[i].det;
                                modeObjManual.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                        // For Callout
                        if (SaveViewUpdateDeleteGlobal.callout_list != undefined && SaveViewUpdateDeleteGlobal.callout_list.length > 0) {
                            var callout_listCount = SaveViewUpdateDeleteGlobal.callout_list.length;
                            for (var i = 0; i < callout_listCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.callout_list[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.callout_list[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.callout_list[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.callout_list[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.callout_list[i].det;
                                modeObjCallout.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                        // For Legacy
                        if (SaveViewUpdateDeleteGlobal.legacy_list != undefined && SaveViewUpdateDeleteGlobal.legacy_list.length > 0) {
                            var legacy_listCount = SaveViewUpdateDeleteGlobal.legacy_list.length;
                            for (var i = 0; i < legacy_listCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.legacy_list[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.legacy_list[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.legacy_list[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.legacy_list[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.legacy_list[i].det;
                                modeObjLegacy.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                        // For Customer docs
                        if (SaveViewUpdateDeleteGlobal.customerdocs_list != undefined && SaveViewUpdateDeleteGlobal.customerdocs_list.length > 0) {
                            var customerdocs_listCount = SaveViewUpdateDeleteGlobal.customerdocs_list.length;
                            for (var i = 0; i < customerdocs_listCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.customerdocs_list[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.customerdocs_list[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.customerdocs_list[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.customerdocs_list[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.customerdocs_list[i].det;
                                modeObjCust.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                        if (SaveViewUpdateDeleteGlobal.skureference_list != undefined && SaveViewUpdateDeleteGlobal.skureference_list.length > 0) {
                            var skureference_listCount = SaveViewUpdateDeleteGlobal.skureference_list.length;
                            for (var i = 0; i < skureference_listCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.skureference_list[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.skureference_list[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.skureference_list[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.skureference_list[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.skureference_list[i].det;
                                modeObjSku.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                    }
                    // This is for right data
                    if (SaveViewUpdateDeleteGlobal != undefined && SaveViewUpdateDeleteGlobal != "") {
                        if (SaveViewUpdateDeleteGlobal.standard != undefined && SaveViewUpdateDeleteGlobal.standard.length > 0) {
                            var standardCount = SaveViewUpdateDeleteGlobal.standard.length;
                            for (var i = 0; i < standardCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.standard[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.standard[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.standard[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.standard[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.standard[i].det;
                                modeObjManualRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                        // For Callout
                        if (SaveViewUpdateDeleteGlobal.callout != undefined && SaveViewUpdateDeleteGlobal.callout.length > 0) {
                            var calloutCount = SaveViewUpdateDeleteGlobal.callout.length;
                            for (var i = 0; i < calloutCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.callout[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.callout[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.callout[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.callout[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.callout[i].det;
                                modeObjCalloutRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                        // For Legacy
                        if (SaveViewUpdateDeleteGlobal.legacy != undefined && SaveViewUpdateDeleteGlobal.legacy.length > 0) {
                            var legacyCount = SaveViewUpdateDeleteGlobal.legacy.length;
                            for (var i = 0; i < legacyCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.legacy[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.legacy[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.legacy[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.legacy[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.legacy[i].det;
                                modeObjLegacyRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                        // For Customer docs
                        if (SaveViewUpdateDeleteGlobal.customerdocs != undefined && SaveViewUpdateDeleteGlobal.customerdocs.length > 0) {
                            var customerdocsCount = SaveViewUpdateDeleteGlobal.customerdocs.length;
                            for (var i = 0; i < customerdocsCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.customerdocs[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.customerdocs[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.customerdocs[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.customerdocs[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.customerdocs[i].det;
                                modeObjCustRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                        if (SaveViewUpdateDeleteGlobal.skureference != undefined && SaveViewUpdateDeleteGlobal.skureference.length > 0) {
                            var skureferenceCount = SaveViewUpdateDeleteGlobal.skureference.length;
                            for (var i = 0; i < skureferenceCount; i++) {
                                listDataName = SaveViewUpdateDeleteGlobal.skureference[i].fd;
                                listDataId = SaveViewUpdateDeleteGlobal.skureference[i].eId;
                                EditCheck = SaveViewUpdateDeleteGlobal.skureference[i].ed;
                                HeaderCheck = SaveViewUpdateDeleteGlobal.skureference[i].hdr;
                                HiddenCheck = SaveViewUpdateDeleteGlobal.skureference[i].det;
                                modeObjSkuRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                            }
                        }
                    }
                });
                    // this itself is for
                    manualObj = {
                        "left": modeObjManual,
                        "right": modeObjManualRight
                    }
                    callOutObj = {
                        "left": modeObjCallout,
                        "right": modeObjCalloutRight
                    }
                    legacyObj = {
                        "left": modeObjLegacy,
                        "right": modeObjLegacyRight
                    }
                    custObj = {
                        "left": modeObjCust,
                        "right": modeObjCustRight
                    }
                    skuObj = {
                        "left": modeObjSku,
                        "right": modeObjSkuRight
                    }
                     //This is to display all the field data in container
            switch ($scope.orderTypeMode) {
                case 'Manual':
                    $scope.orderListItems = manualObj;
                    break;
                case 'Callout':
                    $scope.orderListItems = callOutObj;
                    break;
                case 'Legacy':
                    $scope.orderListItems = legacyObj;
                    break;
                case 'Customer Docs':
                    $scope.orderListItems = custObj;
                    break;
                case 'Sku Reference':
                    $scope.orderListItems = skuObj;
                    break;
                default:
                    break;
            }
                
                }


            }
           
            _initializeComponent();
            // } check here changed
        }
        _getDataEditorViewService = function(editViewMode) {

            if (flagCreate == false) {
                $rootScope.EditDataView = undefined;
                $rootScope.deleteResponse = undefined;
            }
            var ViewEditMode = editViewMode;
            if (details != undefined) {
                version_id = details.versionId;
            } else {
                version_id = $scope.disOrModeData.dsVid;
            }
            // if(ViewEditMode!="View"){
            if (SaveViewUpdateDeleteGlobal != "" && SaveViewUpdateDeleteGlobal != undefined) {
                if (ViewFlag == true && ViewSaveCounter <= 0) {
                    dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                    updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                    version_id = SaveViewUpdateDeleteGlobal.dsVid;
                    ViewSaveCounter++;
                } else if (SaveFlag = true && ViewSaveCounter <= 0) {
                    dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                    updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                    version_id = SaveViewUpdateDeleteGlobal.dsVid;
                    //ViewSaveCounter++;

                } else {
                    if (SaveViewUpdateDeleteGlobal.dVerNo != undefined) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                        updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                        version_id = SaveViewUpdateDeleteGlobal.dsVid;
                    }
                    //other reponse
                    else if (SaveViewUpdateDeleteGlobal.dsVerNo != undefined) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dsVerNo
                        updateTranId = SaveViewUpdateDeleteGlobal.updTranId;
                        version_id = VersionGlobal;
                    }
                }
            }
            // if(details!=undefined && ViewEditMode!="View"){
            DatasetService.viewOrderMode(version_id, dsVerNo, updateTranId, timeStamp).then(function(response) {
                $scope.Editresponse = response
                SaveViewUpdateDeleteGlobal = response;
                console.log("datasetDetails",datasetDetails);
                
                //$scope.datasetDetail.dVerStat = "WIPCheck";
                console.log("called here");
                holdVNo = $scope.Editresponse.dsVerNo;
                ViewData = response;
                ManLeftLength = ViewData.standard_list.length;
                ManRightLength = ViewData.standard.length;
                CalLeftLength = ViewData.callout_list.length;
                CalRightLength = ViewData.callout.length;
                LegLeftLength = ViewData.legacy_list.length;
                LegRightLength = ViewData.legacy.length;
                CustLeftLength = ViewData.customerdocs_list.length;
                custRightLength = ViewData.customerdocs.length;
                SkuLeftLength = ViewData.skureference_list.length;
                SkuRightLength = ViewData.skureference.length;

                //manual left
                for (var i = 0; i < ManLeftLength; i++) {
                    listDataName = ViewData.standard_list[i].fd;
                    listDataId = ViewData.standard_list[i].eId;
                    EditCheck = ViewData.standard_list[i].ed;
                    HeaderCheck = ViewData.standard_list[i].hdr;
                    HiddenCheck = ViewData.standard_list[i].det;
                    modeObjManual.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                // manual right
                for (var i = 0; i < ManRightLength; i++) {
                    listDataName = ViewData.standard[i].fd;
                    listDataId = ViewData.standard[i].eId;
                    EditCheck = ViewData.standard[i].ed;
                    HeaderCheck = ViewData.standard[i].hdr;
                    HiddenCheck = ViewData.standard[i].det;
                    modeObjManualRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                //Callout left
                for (var i = 0; i < CalLeftLength; i++) {
                    listDataName = ViewData.callout_list[i].fd;
                    listDataId = ViewData.callout_list[i].eId;
                    EditCheck = ViewData.callout_list[i].ed;
                    HeaderCheck = ViewData.callout_list[i].hdr;
                    HiddenCheck = ViewData.callout_list[i].det;
                    modeObjCallout.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                //callout right
                for (var i = 0; i < CalRightLength; i++) {
                    listDataName = ViewData.callout[i].fd;
                    listDataId = ViewData.callout[i].eId;
                    EditCheck = ViewData.callout[i].ed;
                    HeaderCheck = ViewData.callout[i].hdr;
                    HiddenCheck = ViewData.callout[i].det;
                    modeObjCalloutRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                //Legacy left
                for (var i = 0; i < LegLeftLength; i++) {
                    listDataName = ViewData.legacy_list[i].fd;
                    listDataId = ViewData.legacy_list[i].eId;
                    EditCheck = ViewData.legacy_list[i].ed;
                    HeaderCheck = ViewData.legacy_list[i].hdr;
                    HiddenCheck = ViewData.legacy_list[i].det;
                    modeObjLegacy.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                //Legacy right
                for (var i = 0; i < LegRightLength; i++) {
                    listDataName = ViewData.legacy[i].fd;
                    listDataId = ViewData.legacy[i].eId;
                    EditCheck = ViewData.legacy[i].ed;
                    HeaderCheck = ViewData.legacy[i].hdr;
                    HiddenCheck = ViewData.legacy[i].det;
                    modeObjLegacyRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                //CustDocs left
                for (var i = 0; i < CustLeftLength; i++) {
                    listDataName = ViewData.customerdocs_list[i].fd;
                    listDataId = ViewData.customerdocs_list[i].eId;
                    EditCheck = ViewData.customerdocs_list[i].ed;
                    HeaderCheck = ViewData.customerdocs_list[i].hdr;
                    HiddenCheck = ViewData.customerdocs_list[i].det;
                    modeObjCust.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                //CustDocs right
                for (var i = 0; i < custRightLength; i++) {
                    listDataName = ViewData.customerdocs[i].fd;
                    listDataId = ViewData.customerdocs[i].eId;
                    EditCheck = ViewData.customerdocs[i].ed;
                    HeaderCheck = ViewData.customerdocs[i].hdr;
                    HiddenCheck = ViewData.customerdocs[i].det;
                    modeObjCustRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                //Sku left
                for (var i = 0; i < SkuLeftLength; i++) {
                    listDataName = ViewData.skureference_list[i].fd;
                    listDataId = ViewData.skureference_list[i].eId;
                    EditCheck = ViewData.skureference_list[i].ed;
                    HeaderCheck = ViewData.skureference_list[i].hdr;
                    HiddenCheck = ViewData.skureference_list[i].det;
                    modeObjSku.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                //Sku right
                for (var i = 0; i < SkuRightLength; i++) {
                    listDataName = ViewData.skureference[i].fd;
                    listDataId = ViewData.skureference[i].eId;
                    EditCheck = ViewData.skureference[i].ed;
                    HeaderCheck = ViewData.skureference[i].hdr;
                    HiddenCheck = ViewData.skureference[i].det;
                    modeObjSkuRight.push({ "itemText": listDataName, "id": listDataId, "Editable": EditCheck, "Header": HeaderCheck, "Hidden": HiddenCheck });
                }
                EditApiCounter++;
            });

            manualObj = {
                "left": modeObjManual,
                "right": modeObjManualRight
            }
            callOutObj = {
                "left": modeObjCallout,
                "right": modeObjCalloutRight
            }
            legacyObj = {
                "left": modeObjLegacy,
                "right": modeObjLegacyRight
            }
            custObj = {
                "left": modeObjCust,
                "right": modeObjCustRight
            }
            skuObj = {
                "left": modeObjSku,
                "right": modeObjSkuRight
            }


            //This is to display all the field data in container
            switch ($scope.orderTypeMode) {
                case 'Manual':
                    $scope.orderListItems = manualObj;
                    break;
                case 'Callout':
                    $scope.orderListItems = callOutObj;
                    break;
                case 'Legacy':
                    $scope.orderListItems = legacyObj;
                    break;
                case 'Customer Docs':
                    $scope.orderListItems = custObj;
                    break;
                case 'Sku Reference':
                    $scope.orderListItems = skuObj;
                    break;
                default:
                    break;
            }


            if (editViewMode != "View")
                _initializeComponent();
        }

        //Watcher to keep track of the change of the drop down
        $scope.$watch('orderTypeMode', function(newVal, OldVal) {
            if (firstLoad) {
                firstLoad = false;
                if ($scope.displayMode == "Create")
                    _getALLValService();
                else
                    _getDataEditorViewService($scope.displayMode);
            }

            switch (newVal) {
                case 'Manual':
                    $scope.orderListItems = manualObj;
                    break;
                case 'Callout':
                    $scope.orderListItems = callOutObj;
                    break;
                case 'Legacy':
                    $scope.orderListItems = legacyObj;
                    break;
                case 'Customer Docs':
                    $scope.orderListItems = custObj;
                    break;
                case 'Sku Reference':
                    $scope.orderListItems = skuObj;
                    break;
                default:
                    break;
            }
        });


        // This is used for service call
        $scope.dispOrModeUpdate = function() {
            $scope.$watch();

            manArry = [];
            callArry = [];
            legArry = [];
            custArry = [];
            skuArry = [];

            if (manualObj.right.length != undefined) {
                var manLeng = manualObj.right.length;
            }
            if (callOutObj.right.length != undefined) {
                var callLeng = callOutObj.right.length;
            }
            if (legacyObj.right.length != undefined) {
                var legLeng = legacyObj.right.length;
            }
            if (custObj.right.length != undefined) {
                var custLeng = custObj.right.length;
            }
            if (skuObj.right.length != undefined) {
                var skuLeng = skuObj.right.length;
            }
            if ($($("#sortable2 li")[k]).find(".selectors input").checked != undefined) {

                for (var k = 0; k < manLeng; k++) {
                    manualObj.right[k].Editable = $($("#sortable2 li")[k]).find(".selectors input")[0].checked;
                    manualObj.right[k].Header = $($("#sortable2 li")[k]).find(".selectors input")[1].checked;
                    manualObj.right[k].Hidden = $($("#sortable2 li")[k]).find(".selectors input")[2].checked;
                }
                for (var k = 0; k < callLeng; k++) {
                    callOutObj.right[k].Editable = $($("#sortable2 li")[k]).find(".selectors input")[0].checked;
                    callOutObj.right[k].Header = $($("#sortable2 li")[k]).find(".selectors input")[1].checked;
                    callOutObj.right[k].Hidden = $($("#sortable2 li")[k]).find(".selectors input")[2].checked;
                }
                for (var k = 0; k < legLeng; k++) {
                    legacyObj.right[k].Editable = $($("#sortable2 li")[k]).find(".selectors input")[0].checked;
                    legacyObj.right[k].Header = $($("#sortable2 li")[k]).find(".selectors input")[1].checked;
                    legacyObj.right[k].Hidden = $($("#sortable2 li")[k]).find(".selectors input")[2].checked;
                }
                for (var k = 0; k < custLeng; k++) {
                    custObj.right[k].Editable = $($("#sortable2 li")[k]).find(".selectors input")[0].checked;
                    custObj.right[k].Header = $($("#sortable2 li")[k]).find(".selectors input")[1].checked;
                    custObj.right[k].Hidden = $($("#sortable2 li")[k]).find(".selectors input")[2].checked;
                }
                for (var k = 0; k < skuLeng; k++) {
                    skuObj.right[k].Editable = $($("#sortable2 li")[k]).find(".selectors input")[0].checked;
                    skuObj.right[k].Header = $($("#sortable2 li")[k]).find(".selectors input")[1].checked;
                    skuObj.right[k].Hidden = $($("#sortable2 li")[k]).find(".selectors input")[2].checked;
                }
            }
            // var version_id = $scope.disOrModeData.versionId;
            //dataTransferService.setVersionId(version_id);
            //var updateTranId = $scope.disOrModeData.updateTransId;
            //var dsVerNo = $scope.datasetDetaildata.dVerNo;
            $scope.dispMode = $('#orderTypeDropDown').val();
            $scope.action = "create";
            $scope.displayedFieldsVOList = [];
            var displayModesJSON = [];
            var manaulListFields = [];
            var callListFields = [];
            var legacyListFields = [];
            var custListFields = [];
            var skuListListFields = [];
            var i;
            var j;
            var editable;
            var itemHeader;
            var hidden;
            // removing duplicate json objects from element id
            var Mancollection = [];
            var Calcollection = [];
            var Legcollection = [];
            var Cuscollection = [];
            var Skucollection = [];
            var Manarr = [];
            var Calarr = [];
            var Legarr = [];
            var Cusarr = [];
            var Skuarr = [];


            //Manual duplicate remove	
            $.each(manualObj.right, function(index, value) {
                if ($.inArray(value.id, Manarr) == -1) {
                    Manarr.push(value.id);
                    Mancollection.push(value);
                    manualObj.right = Mancollection;
                }
            });
            //Callout duplicate remove	
            $.each(callOutObj.right, function(index, value) {
                if ($.inArray(value.id, Calarr) == -1) {
                    Calarr.push(value.id);
                    Calcollection.push(value);
                    callOutObj.right = Calcollection;
                }
            });
            //Legacy duplicate remove	
            $.each(legacyObj.right, function(index, value) {
                if ($.inArray(value.id, Legarr) == -1) {
                    Legarr.push(value.id);
                    Legcollection.push(value);
                    legacyObj.right = Legcollection;
                }
            });
            //CustomerDocs duplicate remove	
            $.each(custObj.right, function(index, value) {
                if ($.inArray(value.id, Cusarr) == -1) {
                    Cusarr.push(value.id);
                    Cuscollection.push(value);
                    custObj.right = Cuscollection;
                }
            });
            //Sku duplicate remove	
            $.each(skuObj.right, function(index, value) {
                if ($.inArray(value.id, Skuarr) == -1) {
                    Skuarr.push(value.id);
                    Skucollection.push(value);
                    skuObj.right = Skucollection;
                }
            });
            // removing end
            for (i = 0; i < manualObj.right.length; i++) {
                var objId = manualObj.right[i].id;
                var editableCheckVal = manualObj.right[i].Editable;
                var hederCheckVal = manualObj.right[i].Header;
                var hiddenCheckVal = manualObj.right[i].Hidden;
                if (editableCheckVal == true) {
                    editableCheckVal = "Y"
                } else {
                    editableCheckVal = "N"
                }
                if (hederCheckVal == true) {
                    hederCheckVal = "Y"
                } else {
                    hederCheckVal = "N"
                }
                if (hiddenCheckVal == true) {
                    hiddenCheckVal = "Y"
                } else {
                    hiddenCheckVal = "N"
                }
                manaulListFields.push({ "elementId": objId, "editable": editableCheckVal, "itemHeader": hederCheckVal, "hidden": hiddenCheckVal, "displayOrder": i })
            }
            for (i = 0; i < callOutObj.right.length; i++) {
                var objId = callOutObj.right[i].id;
                var editableCheckVal = callOutObj.right[i].Editable;
                var hederCheckVal = callOutObj.right[i].Header;
                var hiddenCheckVal = callOutObj.right[i].Hidden;
                if (editableCheckVal == true) {
                    editableCheckVal = "Y"
                } else {
                    editableCheckVal = "N"
                }
                if (hederCheckVal == true) {
                    hederCheckVal = "Y"
                } else {
                    hederCheckVal = "N"
                }
                if (hiddenCheckVal == true) {
                    hiddenCheckVal = "Y"
                } else {
                    hiddenCheckVal = "N"
                }
                callListFields.push({ "elementId": objId, "editable": editableCheckVal, "itemHeader": hederCheckVal, "hidden": hiddenCheckVal, "displayOrder": i })
            }
            for (i = 0; i < legacyObj.right.length; i++) {
                var objId = legacyObj.right[i].id;
                var editableCheckVal = legacyObj.right[i].Editable;
                var hederCheckVal = legacyObj.right[i].Header;
                var hiddenCheckVal = legacyObj.right[i].Hidden;
                if (editableCheckVal == true) {
                    editableCheckVal = "Y"
                } else {
                    editableCheckVal = "N"
                }
                if (hederCheckVal == true) {
                    hederCheckVal = "Y"
                } else {
                    hederCheckVal = "N"
                }
                if (hiddenCheckVal == true) {
                    hiddenCheckVal = "Y"
                } else {
                    hiddenCheckVal = "N"
                }
                legacyListFields.push({ "elementId": objId, "editable": editableCheckVal, "itemHeader": hederCheckVal, "hidden": hiddenCheckVal, "displayOrder": i })
            }
            for (i = 0; i < custObj.right.length; i++) {
                var objId = custObj.right[i].id;
                var editableCheckVal = custObj.right[i].Editable;
                var hederCheckVal = custObj.right[i].Header;
                var hiddenCheckVal = custObj.right[i].Hidden;
                if (editableCheckVal == true) {
                    editableCheckVal = "Y"
                } else {
                    editableCheckVal = "N"
                }
                if (hederCheckVal == true) {
                    hederCheckVal = "Y"
                } else {
                    hederCheckVal = "N"
                }
                if (hiddenCheckVal == true) {
                    hiddenCheckVal = "Y"
                } else {
                    hiddenCheckVal = "N"
                }
                custListFields.push({ "elementId": objId, "editable": editableCheckVal, "itemHeader": hederCheckVal, "hidden": hiddenCheckVal, "displayOrder": i })
            }
            for (i = 0; i < skuObj.right.length; i++) {
                var objId = skuObj.right[i].id;
                var editableCheckVal = skuObj.right[i].Editable;
                var hederCheckVal = skuObj.right[i].Header;
                var hiddenCheckVal = skuObj.right[i].Hidden;
                if (editableCheckVal == true) {
                    editableCheckVal = "Y"
                } else {
                    editableCheckVal = "N"
                }
                if (hederCheckVal == true) {
                    hederCheckVal = "Y"
                } else {
                    hederCheckVal = "N"
                }
                if (hiddenCheckVal == true) {
                    hiddenCheckVal = "Y"
                } else {
                    hiddenCheckVal = "N"
                }
                skuListListFields.push({ "elementId": objId, "editable": editableCheckVal, "itemHeader": hederCheckVal, "hidden": hiddenCheckVal, "displayOrder": i })
            }
            // end
            displayModesJSON.push({ "displayMode": "standard", "displayedFieldsVOList": manaulListFields }, { "displayMode": "callout", "displayedFieldsVOList": callListFields }, { "displayMode": "legacy", "displayedFieldsVOList": legacyListFields }, { "displayMode": "customerdocs", "displayedFieldsVOList": custListFields }, { "displayMode": "skureference", "displayedFieldsVOList": skuListListFields })
            if (manualObj.right.length >= 1 || callOutObj.right.length >= 1 ||
                legacyObj.right.length >= 1 || custObj.right.length >= 1 || skuObj.right.length >= 1) {
                //VersionNo and updateTranID for createorderDisplay
                var details = localStoreService.get('editdatasetdetails');
                if (details != undefined) {
                    version_id = details.versionId;
                } else {
                    version_id = $scope.disOrModeData.dsVid;
                }
                if ($scope.disOrModeData == undefined) {
                    var saveData = true;
                } else if ($scope.disOrModeData != undefined) {
                    var saveData = true;
                }
                if (SaveViewUpdateDeleteGlobal != "" && SaveViewUpdateDeleteGlobal != undefined) {
                    if (ViewFlag == true && ViewSaveCounter <= 0) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                        updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                        version_id = SaveViewUpdateDeleteGlobal.dsVid;
                        ViewSaveCounter++;
                    } else if (SaveFlag = true && ViewSaveCounter <= 0) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                        updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                        version_id = SaveViewUpdateDeleteGlobal.dsVid;
                        //ViewSaveCounter++;
                    } else {
                        //save api called
                    if (SaveViewUpdateDeleteGlobal.dVerNo != undefined) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dVerNo;
                        updateTranId = SaveViewUpdateDeleteGlobal.uTransId;
                        version_id = SaveViewUpdateDeleteGlobal.dsVid;
                    }
                        //other reponse
                    else if (SaveViewUpdateDeleteGlobal.dsVerNo != undefined) {
                        dsVerNo = SaveViewUpdateDeleteGlobal.dsVerNo
                        updateTranId = SaveViewUpdateDeleteGlobal.updTranId;
                        version_id = VersionGlobal;
                    }

                    }
                }

                $scope.fieldArry = { "dsVersionId": version_id, "dsVerNo": dsVerNo, "updateTranId": updateTranId, "displayModesJSON": displayModesJSON }
                DatasetService.displayOrderMode($scope.fieldArry).then(function(response) {
                        Editcounter++;
                        $rootScope.EditDataView = response;
                        SaveViewUpdateDeleteGlobal = response;
                        UpdateResponse = response;
                        //holdVNo=$rootScope.EditDataView.dsVerNo;
                        if ($scope.disOrModeData != undefined) {
                            $scope.disOrModeData.dVerNo = response.dsVerNo;
                            $scope.disOrModeData.uTransId = response.updTranId;
                        }
                        CreateDataResponse = response;
                        $scope.datasetDetail = response;
                        $rootScope.openToast("DataSource saved successfully", 3000, "autoClose");

                        //cnt.editstd=true;
                        //$scope.editDatasetCheck = true;
                        if (SaveViewUpdateDeleteGlobal != undefined && SaveViewUpdateDeleteGlobal != "") {
                            if (SaveViewUpdateDeleteGlobal.standard != undefined) {
                                if (SaveViewUpdateDeleteGlobal.standard.length > 0) {
                                    cnt.createstd = false;
                                    cnt.editstd = true;
                                    cnt.viewstd = false;
                                    cnt.deletestd = true;
                                }

                            }
                            if (SaveViewUpdateDeleteGlobal.callout != undefined) {
                                if (SaveViewUpdateDeleteGlobal.callout.length > 0) {
                                    cnt.createcall = false;
                                    cnt.editcall = true;
                                    cnt.viewcall = false;
                                    cnt.deletecall = true;
                                }

                            }
                            if (SaveViewUpdateDeleteGlobal.legacy != undefined) {
                                if (SaveViewUpdateDeleteGlobal.legacy.length > 0) {
                                    cnt.createlegy = false;
                                    cnt.editlegy = true;
                                    cnt.viewlegy = false;
                                    cnt.deletelegy = true;
                                }

                            }
                            if (SaveViewUpdateDeleteGlobal.customerdocs != undefined) {
                                if (SaveViewUpdateDeleteGlobal.customerdocs.length > 0) {
                                    cnt.createcustdocs = false;
                                    cnt.editcustdocs = true;
                                    cnt.viewcustdocs = false;
                                    cnt.deletecust = true;
                                }

                            }
                            if (SaveViewUpdateDeleteGlobal.skureference != undefined) {
                                if (SaveViewUpdateDeleteGlobal.skureference.length > 0) {
                                    cnt.createskurefer = false;
                                    cnt.editskurefer = true;
                                    cnt.viewskurefer = false;
                                    cnt.deleteskurefer = true;
                                }

                            }
                        }

                    })
                    // , function (errorMessage) {
                    // // 	console.error('error');
                    // // }

            } else {
                $rootScope.openToast("An error occurred, please select one DataSet Field.", 0, "manualClose");
                if ($scope.orderTypeMode == "Manual") {
                    cnt.createstd = true;
                    cnt.editstd = false;
                    cnt.viewstd = false;
                    cnt.deletestd = false;
                } else if ($scope.orderTypeMode == "Callout") {
                    cnt.createcall = true;
                    cnt.editcall = false;
                    cnt.viewcall = false;
                    cnt.deletecall = false;
                } else if ($scope.orderTypeMode == "Legacy") {
                    cnt.createlegy = true;
                    cnt.editlegy = false;
                    cnt.viewlegy = false;
                    cnt.deletelegy = false;
                } else if ($scope.orderTypeMode == "Customer Docs") {
                    cnt.createcustdocs = true;
                    cnt.editcustdocs = false;
                    cnt.viewcustdocs = false;
                    cnt.deletecust = false;
                } else if ($scope.orderTypeMode == "Sku Reference") {
                    cnt.createskurefer = true;
                    cnt.editskurefer = false;
                    cnt.viewskurefer = false;
                    cnt.deleteskurefer = false;
                } else {
                    //cnt.editstd=false;cnt.editcall=false;cnt.editlegy=false;cnt.viewcareins=false;cnt.editcustdocs=false;

                }
            }

            $mdDialog.hide();
        }

        //Manual duplicate remove	

        // removing end
        $scope.copyDisplayOrModes = function() {
            // removing duplicate json objects from element id
            var Mancollection = [];
            var Calcollection = [];
            var Legcollection = [];
            var Cuscollection = [];
            var Skucollection = [];
            var Manarr = [];
            var Calarr = [];
            var Legarr = [];
            var Cusarr = [];
            var Skuarr = [];
            if (manualObj != undefined && manualObj.right.length > 0) {
                $.each(manualObj.right, function(index, value) {
                    if ($.inArray(value.id, Manarr) == -1) {
                        Manarr.push(value.id);
                        Mancollection.push(value);
                        manualObj.right = Mancollection;
                    }
                });
            }
            //Callout duplicate remove	
            if (callOutObj != undefined && callOutObj.right.length > 0) {
                $.each(callOutObj.right, function(index, value) {
                    if ($.inArray(value.id, Calarr) == -1) {
                        Calarr.push(value.id);
                        Calcollection.push(value);
                        callOutObj.right = Calcollection;
                    }
                });
            }
            //Legacy duplicate remove	
            if (legacyObj != undefined && legacyObj.right.length > 0) {
                $.each(legacyObj.right, function(index, value) {
                    if ($.inArray(value.id, Legarr) == -1) {
                        Legarr.push(value.id);
                        Legcollection.push(value);
                        legacyObj.right = Legcollection;
                    }
                });
            }
            //CustomerDocs duplicate remove	
            if (custObj != undefined && custObj.right.length > 0) {
                $.each(custObj.right, function(index, value) {
                    if ($.inArray(value.id, Cusarr) == -1) {
                        Cusarr.push(value.id);
                        Cuscollection.push(value);
                        custObj.right = Cuscollection;
                    }
                });
            }
            //Sku duplicate remove	
            if (skuObj != undefined && skuObj.right.length > 0) {
                $.each(skuObj.right, function(index, value) {
                    if ($.inArray(value.id, Skuarr) == -1) {
                        Skuarr.push(value.id);
                        Skucollection.push(value);
                        skuObj.right = Skucollection;
                    }
                });
            }
            if ($scope.mode == "Manual") {
                if ($scope.orderTypeMode == "Callout") {
                    callOutObj = manualObj;
                    $scope.orderListItems = manualObj;
                } else if ($scope.orderTypeMode == "Legacy") {
                    legacyObj = manualObj;
                    $scope.orderListItems = manualObj;
                } else if ($scope.orderTypeMode == "Customer Docs") {
                    custObj = manualObj;
                    $scope.orderListItems = manualObj;
                } else if ($scope.orderTypeMode == "Sku Reference") {
                    skuObj = manualObj;
                    $scope.orderListItems = manualObj;
                }

            } else if ($scope.mode == "Callout") {
                if ($scope.orderTypeMode == "Manual") {
                    manualObj = callOutObj;
                    $scope.orderListItems = callOutObj;
                } else if ($scope.orderTypeMode == "Legacy") {
                    legacyObj = callOutObj;
                    $scope.orderListItems = callOutObj;
                } else if ($scope.orderTypeMode == "Customer Docs") {
                    custObj = callOutObj;
                    $scope.orderListItems = callOutObj;
                } else if ($scope.orderTypeMode == "Sku Reference") {
                    skuObj = callOutObj;
                    $scope.orderListItems = callOutObj;
                }
            } else if ($scope.mode == "Legacy") {
                if ($scope.orderTypeMode == "Manual") {
                    manualObj = legacyObj;
                    $scope.orderListItems = legacyObj;
                } else if ($scope.orderTypeMode == "Callout") {
                    callOutObj = legacyObj;
                    $scope.orderListItems = legacyObj;
                } else if ($scope.orderTypeMode == "Customer Docs") {
                    custObj = legacyObj;
                    $scope.orderListItems = legacyObj;
                } else if ($scope.orderTypeMode == "Sku Reference") {
                    skuObj = legacyObj;
                    $scope.orderListItems = legacyObj;
                }
            } else if ($scope.mode == "Customer Docs") {
                if ($scope.orderTypeMode == "Manual") {
                    manualObj = custObj;
                    $scope.orderListItems = custObj;
                } else if ($scope.orderTypeMode == "Callout") {
                    callOutObj = custObj;
                    $scope.orderListItems = custObj;
                } else if ($scope.orderTypeMode == "Legacy") {
                    legacyObj = custObj;
                    $scope.orderListItems = custObj;
                } else if ($scope.orderTypeMode == "Sku Reference") {
                    skuObj = custObj;
                    $scope.orderListItems = custObj;
                }
            } else if ($scope.mode == "Sku Reference") {
                if ($scope.orderTypeMode == "Manual") {
                    manualObj = skuObj;
                    $scope.orderListItems = skuObj;
                } else if ($scope.orderTypeMode == "Callout") {
                    callOutObj = skuObj;
                    $scope.orderListItems = skuObj;
                } else if ($scope.orderTypeMode == "Legacy") {
                    legacyObj = skuObj;
                    $scope.orderListItems = skuObj;
                } else if ($scope.orderTypeMode == "Customer Docs") {
                    custObj = skuObj;
                    $scope.orderListItems = skuObj;
                }
            }
        }

        //selected dataset field 
        $scope.highLightItem=function(event,colName){
            // console.log("call1111");
            // $scope.removeHover=event.currentTarget;
            // console.log(" $scope.removeHover", $scope.removeHover);
            // $(".firstCol li").removeClass('highLightSelected');
            // $(".thirdCol li").removeClass('highLightSelected');
            // $(event.target).addClass('highLightSelected');
        }

        //Move right function 
        $scope.moveToRight = function() {
                var rgtlength = $(".firstCol li").length;
                console.log("rgtlength",rgtlength);
                var indxToMove = $(".firstCol li").index();
                $scope.activeItem = '';
                if ($scope.orderTypeMode == "Manual" && manualObj.left.length >= 1) {
                    var removed = manualObj.left.splice(indxToMove,1);
                    manualObj.right.push(removed[0]);
                    $scope.orderListItems = manualObj;
                } else if ($scope.orderTypeMode == "Callout" && callOutObj.left.length >= 1) {
                    var removed = callOutObj.left.splice(indxToMove, 1);
                    callOutObj.right.push(removed[0]);
                    $scope.orderListItems = callOutObj;
                } else if ($scope.orderTypeMode == "Legacy" && legacyObj.left.length >= 1) {
                    var removed = legacyObj.left.splice(indxToMove, 1);
                    legacyObj.right.push(removed[0]);
                    $scope.orderListItems = legacyObj;
                } else if ($scope.orderTypeMode == "Customer Docs" && custObj.left.length >= 1) {
                    var removed = custObj.left.splice(indxToMove, 1);
                    custObj.right.push(removed[0]);
                    $scope.orderListItems = custObj;
                } else if ($scope.orderTypeMode == "Sku Reference" && skuObj.left.length >= 1) {
                    var removed = skuObj.left.splice(indxToMove, 1);
                    skuObj.right.push(removed[0]);
                    $scope.orderListItems = skuObj;
                }
            }
            //move left function
        $scope.moveToLeft = function() {
                // if($(".firstCol li.active").length == 0) return; 
                // var indxToMove = $(".firstCol li.active").index();
                var rgtlength = $(".thirdCol li").length;
                var indxToMove = $(".thirdCol li").index();
                $scope.activeItem = '';
                if ($scope.orderTypeMode == "Manual" && manualObj.right.length >= 1) {
                    var removed = manualObj.right.splice(indxToMove,1);
                    manualObj.left.push(removed[0]);
                    $scope.orderListItems = manualObj; 
                } else if ($scope.orderTypeMode == "Callout" && callOutObj.right.length >= 1) {
                    var removed = callOutObj.right.splice(indxToMove, 1);
                    callOutObj.left.push(removed[0]);
                    $scope.orderListItems = callOutObj;
                } else if ($scope.orderTypeMode == "Legacy" && legacyObj.right.length >= 1) {
                    var removed = legacyObj.right.splice(indxToMove, 1);
                    legacyObj.left.push(removed[0]);
                    $scope.orderListItems = legacyObj;
                } else if ($scope.orderTypeMode == "Customer Docs" && custObj.right.length >= 1) {
                    var removed = custObj.right.splice(indxToMove, 1);
                    custObj.left.push(removed[0]);
                    $scope.orderListItems = custObj;
                } else if ($scope.orderTypeMode == "Sku Reference" && skuObj.right.length >= 1) {
                    var removed = skuObj.right.splice(indxToMove, 1);
                    skuObj.left.push(removed[0]);
                    $scope.orderListItems = skuObj;
                }

            }
            // This functionality is for key up and down
        $scope.removeAndAppendToUp = function() {
            //if($(".firstCol li.active").length == 0) return; 
            //var indxToMove = $(".firstCol li.active").index();
            var length = $(".thirdCol li").length;
            if (length >= 0) {
                var indxToMove = $(".thirdCol li").index();
                $scope.activeItem = '';
                switch ($scope.orderTypeMode) {
                    case "Manual":
                        var removed = manualObj.right.splice(indxToMove, 1);
                        manualObj.right.push(removed[0]);
                        $scope.orderListItems = manualObj;
                        break;
                    case "Callout":
                        var removed = callOutObj.right.splice(indxToMove, 1);
                        callOutObj.right.push(removed[0]);
                        $scope.orderListItems = callOutObj;
                        break;
                    case "Legacy":
                        var removed = legacyObj.right.splice(indxToMove, 1);
                        legacyObj.right.push(removed[0]);
                        $scope.orderListItems = legacyObj;
                        break;
                    case "Customer Docs":
                        var removed = custObj.right.splice(indxToMove, 1);
                        custObj.right.push(removed[0]);
                        $scope.orderListItems = custObj;
                        break;
                    case "Sku Reference":
                        var removed = skuObj.right.splice(indxToMove, 1);
                        skuObj.right.push(removed[0]);
                        $scope.orderListItems = skuObj;
                        break;
                }
            }
        }
        $scope.removeAndAppendToDown = function() {
                //if($(".firstCol li.active").length == 0) return; 
                //var indxToMove = $(".firstCol li.active").index();
                var length = $(".thirdCol li").length;
                if (length >= 0) {
                    var indxToMove = $(".thirdCol li").index();
                    $scope.activeItem = '';
                    switch ($scope.orderTypeMode) {
                        case "Manual":
                            var removed = manualObj.right.splice(indxToMove, 1);
                            manualObj.right.push(removed[0]);
                            $scope.orderListItems = manualObj;
                            break;
                        case "Callout":
                            var removed = callOutObj.right.splice(indxToMove, 1);
                            callOutObj.right.push(removed[0]);
                            $scope.orderListItems = callOutObj;
                            break;
                        case "Legacy":
                            var removed = legacyObj.right.splice(indxToMove, 1);
                            legacyObj.right.push(removed[0]);
                            $scope.orderListItems = legacyObj;
                            break;
                        case "Customer Docs":
                            var removed = custObj.right.splice(indxToMove, 1);
                            custObj.right.push(removed[0]);
                            $scope.orderListItems = custObj;
                            break;
                        case "Sku Reference":
                            var removed = skuObj.right.splice(indxToMove, 1);
                            skuObj.right.push(removed[0]);
                            $scope.orderListItems = skuObj;
                            break;
                    }
                }
            }
            // This functionality is for key up and down end
        $scope.Cancel = function() {
            $mdDialog.hide();
        }
    }





    // This is modal is for Element Properties
    $scope.ElemProp = function(createEvent) {
        $mdDialog.show({
                controller: ElementPropertyCtrl,
                templateUrl: 'html/dw/evdp/ListView.html',
                parent: angular.element(document.body),
                targetEvent: createEvent,
                clickOutsideToClose: false
            })
            .then(function() {},
                function() {
                    $scope.status = 'Failed to cancel';
                });
    }

    function ElementPropertyCtrl($scope, $mdDialog) {
        $scope.AddLookUpAlgorithm = function() {
            $location.path('/AddLookUpAlgorithm');
            $mdDialog.hide();
        }
        $scope.Cancel = function() {
            $mdDialog.hide();
        }
    }

    //end here
    $scope.openCalculationPage = function(element, event) {
        localStoreService.store('calcElem', element);
        $scope.viewCalculation(event);
    }

    $scope.openCalcPage = function(event){
        angular.forEach($scope.datasource.eAr, function(dsElement) {
            if (dsElement.gridPr.typ === 'DataSource') {
                $scope.datasourceExist = true;
                $scope.eId = { eId: dsElement.eId, eNm: dsElement.gridPr.eNm };
                $scope.datasource.eAr.unshift(($scope.datasource.eAr.splice($scope.datasource.eAr.indexOf(dsElement), 1))[0]);
            }
        });
        $scope.viewCalculation(event);
    }

    $scope.viewCalculation = function(createEvent) {
        BlocklyTransferService.setBlocklyTab(true);
        $mdDialog.show({
                controller: CalculationCtrl,
                templateUrl: 'html/dw/evdp/Calculation.html',
                parent: angular.element(document.body),
                targetEvent: createEvent,
                locals: { dsVid: $scope.datasetDetail.dsVid, dsCustId: $scope.RBCCode },
                clickOutsideToClose: false
            })
            .then(function() {},
                function() {
                    $scope.status = 'Failed to cancel';
                });
    }

    function CalculationCtrl($scope, oktaAuth2Service, $cookies, $mdDialog, CalculationServices, BlocklyTransferService, LogicRefServices, dsVid, dsCustId) {
        oktaAuth2Service.showLogin();
        var oktaUserId = oktaAuth2Service.getLoginUser();
        $cookies.put("DW_LOGGEDIN_USER",  oktaUserId);
        $scope.category = [];
        $scope.defaultCategory = 1;
        $scope.functions = [];
        $scope.defaultValues = [];
        $scope.eId = "";
        $scope.executeTestCompleted = false;
        $scope.CalculationText = "";
        var usrDefAutoComplete = null;
        $scope.toggleClicked = false;
        var dsVersionId = dsVid;
        //var dsVersionId = 600000025099; //600000032252
        var selectedFieldValue = "";
        var cm;
        $scope.isEditBlockly = false;
        $scope.loadDatasource = function() {
            $scope.datasource = [];
            $scope.filteredDatasource = [];
            CalculationServices.getDatasource(dsVersionId).then(function successCallback(data) {
                $scope.datasourceExist = false;
                $scope.datasource = data.responseData;
                $scope.accountName = $scope.datasource.dNm;
                $scope.fieldId = $scope.datasource.eId;
                angular.forEach($scope.datasource.eAr, function(dsElement) {
                    if (dsElement.gridPr.typ === 'DataSource') {
                        $scope.datasourceExist = true;
                        if (dsElement.gridPr.ruleId != null) {
                            $scope.isEditBlockly = true;
                            $scope.ruleId = dsElement.gridPr.ruleId;
                        }
                        $scope.eId = { eId: dsElement.eId, eNm: dsElement.gridPr.eNm };
                        $scope.datasource.eAr.unshift(($scope.datasource.eAr.splice($scope.datasource.eAr.indexOf(dsElement), 1))[0]);
                    }
                });
                // Add new Element Datasource
                if ($scope.datasourceExist === false) {
                    var currentTime = $rootScope.getTimeStampForCurrentDate() + "";
                    var element = {
                        "eId": currentTime,
                        "gridPr": {
                            "fIdCid": dsCustId,
                            "fId": "",
                            "eNm": "DataSource",
                            "typ": "DataSource",
                            "rqd": false,
                            "cas": "N",
                            "msk": "",
                            "mLen": "",
                            "xLen": ""
                        },
                        "popPr": { "calcTxt": "" },
                        "barPr": "",
                        "helptxtPr": ""
                    };
                    $scope.datasource.eAr.push(element);
                    angular.forEach($scope.datasource.eAr, function(dsElement) {
                        if (dsElement.gridPr.typ === 'DataSource') {
                            $scope.eId = { eId: dsElement.eId, eNm: dsElement.gridPr.eNm };
                            $scope.datasource.eAr.unshift(($scope.datasource.eAr.splice($scope.datasource.eAr.indexOf(dsElement), 1))[0]);
                        }
                    });
                }
                //For Element Level Entry from Fields Dropdown
                var elem = localStoreService.get('calcElem');
                if (elem != undefined) {
                    $scope.eId = { eId: elem.eId, eNm: elem.gridPr.eNm };
                    angular.forEach($scope.datasource.eAr, function(dsElement) {
                        if (dsElement.eId === elem.eId) {
                            $scope.datasource.eAr.unshift(($scope.datasource.eAr.splice($scope.datasource.eAr.indexOf(dsElement), 1))[0]);
                        }
                    });
                    if(elem.ruleSelected != undefined && Object.entries(elem.ruleSelected).length != 0){
                        if (typeof cm != 'undefined') {
                            angular.forEach($scope.datasource.eAr, function(dsElement) {
                                if (dsElement.eId === $("#calcTextSelect").val().replace(/string:/g, "")) {
                                    dsElement.popPr.calcTxt = elem.ruleSelected.blocklyJs;
                                    dsElement.popPr.blocklyXml = elem.ruleSelected.blocklyXml;
                                    dsElement.gridPr.isBlocklyCode = 'Y';
                                    $scope.ruleFlag = true;
                                    cm.setValue(elem.ruleSelected.blocklyJs);
                                    BlocklyTransferService.setRule(elem.ruleSelected);
                                }
                            });
                        }
                    }
                    
                }
                angular.forEach($scope.datasource.eAr, function(dsElement) {
                    if (dsElement.gridPr.typ === 'DataSource' || dsElement.gridPr.typ === 'Calculation') {
                        var dsElem = {};
                        dsElem["eId"] = dsElement.eId;
                        dsElem["eNm"] = dsElement.gridPr.eNm;
                        $scope.filteredDatasource.push(dsElem);
                    }
                });


                $scope.eId = $scope.filteredDatasource.length > 0 ? $scope.filteredDatasource[0].eId : 0;
                $scope.startCodeMirrorWithoutValidation();
                $scope.loadDatasourceDefaultValues();
                $scope.getCalculationText($scope.eId);
            });
        }



        $scope.loadDatasourceFunctions = function() {
            var mode = 'MODE_LOAD_FUNC_DATA_ONLY';
            $scope.category = [];
            CalculationServices.getFunctions(dsVersionId, mode).then(function successCallback(data) {
                $scope.category = data;
                usrDefAutoComplete = $scope.category.autoComplete;
            });
        }

        $scope.loadDatasourceDefaultValues = function() {
            var mode = 'MODE_LOAD_ARBITRARY_ONLY';
            $scope.defaultValues = [];
            CalculationServices.getFunctions(dsVersionId, mode).then(function successCallback(data) {
                $scope.defaultValues = data.defaultValues;
                angular.forEach($scope.datasource.eAr, function(dsElement) {
                    angular.forEach($scope.defaultValues, function(defVal) {
                        if (dsElement.eId === defVal.eid) {
                            dsElement.gridPr.dv = setNullToEmpty(defVal.defaultValue);
                        }
                    });
                });
            });
        }

        $scope.getCategoryFunctions = function(categoryId) {
            $scope.functions = [];
            $scope.categorySelected = categoryId;
            angular.forEach($scope.category.funcArray, function(cat) {
                if (cat.catgId === categoryId) {
                    angular.forEach(cat.funcArr, function(func) {
                        $scope.functions.push(func);
                    });
                    return false;
                }
            });
        }

        $scope.getCalculationText = function(eId) {
            $scope.CalculationText = "";
            angular.forEach($scope.datasource.eAr, function(dsElement) {
                if (dsElement.eId === eId) {
                    $scope.userSelectedFieldHtml = dsElement.gridPr.eNm;
                    if (dsElement.gridPr.isBlocklyCode === 'Y') {
                        $scope.ruleFlag = true;
                    } else {
                        $scope.ruleFlag = false;
                    }
                    if (typeof(dsElement.popPr) === 'undefined') {
                        return false;
                    }
                    if (typeof(dsElement.popPr.calcTxt) === 'undefined') {
                        dsElement.popPr["calcTxt"] = "";
                        return false;
                    }
                    $scope.CalculationText = angular.copy(dsElement.popPr.calcTxt.replace(/\\n/g, "\n"));
                    cm.setValue($scope.CalculationText);
                    return false;
                }
            });
        }

        $scope.saveCalculation = function() {
            angular.forEach($scope.datasource.eAr, function(dsElement) {
                if (dsElement.eId === $("#calcTextSelect").val().replace(/string:/g, "")) {
                    $scope.CalculationText = cm.getValue();
                    dsElement.popPr.calcTxt = $scope.CalculationText;
                    return false;
                }
            });
        }

        $scope.saveDatasourceCalculation = function(createEvent) {
            var saveCalc = {
                    'dsVId': '',
                    'elements': [],
                    'orderAttrs': [],
                    'defaultValues': [],
                    'uTransId': '',
                    'customerId': '',
                    'versionNo': '',
                    'blocklyXml': '',
                    'isBlocklyCode': '',
                    'isBlocklyCodeEdited': ''
                }
                //comment entering
            if (BlocklyTransferService.getCommentFlag() == false) {
                $mdDialog.show({
                        controller: CommentController,
                        templateUrl: 'html/dw/evdp/Comments.html',
                        parent: angular.element(document.body),
                        targetEvent: createEvent,
                        clickOutsideToClose: false,
                        multiple: true
                    })
                    .then(function() {},
                        function() {
                            $scope.status = 'Failed to cancel';
                        });
            } else {
                saveCalc.versionNo = $scope.datasource.dVerNo;
                saveCalc.uTransId = $scope.datasource.uTransId;
                saveCalc.customerId = dsCustId;
                saveCalc.dsVId = $scope.datasource.dsVid;
                if ($scope.blocklyData.js != null && $scope.blocklyData.xml != null) {
                    saveCalc.blocklyXml = $scope.blocklyData.xml;
                    saveCalc.isBlocklyCode = 'Y';
                }
                angular.forEach($scope.datasource.dsOrderDetail, function(orderDetails) {
                    var orderAttr = {
                        'oid': orderDetails.oid,
                        'okey': orderDetails.okey,
                        'dvalue': setNullToEmpty(orderDetails.dvalue)
                    }
                    saveCalc.orderAttrs.push(orderAttr);
                });
                angular.forEach($scope.datasource.eAr, function(datasource) {
                    if (datasource.gridPr.typ === 'Calculation' || datasource.gridPr.typ === 'DataSource') {
                        var element = {
                            'eid': datasource.eId,
                            'cscript': (typeof datasource.popPr === 'undefined') ? '' : datasource.popPr.calcTxt
                        }
                        saveCalc.elements.push(element);
                    }
                    var defaultVal = {
                        'eid': datasource.eId,
                        'value': datasource.gridPr.dv,
                        'processedOutput': setNullToEmpty(datasource.processedVal)
                    }
                    saveCalc.defaultValues.push(defaultVal);
                });
                console.info(saveCalc);
                CalculationServices.saveCalculation(saveCalc)
                    .then(function successCallback(response) {
                        if (response.body.code === "201") {
                            $scope.datasource.uTransId = response.body.responseData.uTransId;
                            console.log("response ", response);
                            $rootScope.openToast("Datasource calculation saved successfully", 3000, "autoClose");
                        } else {
                            $rootScope.openToast("Datasource calculation save failed", 0, "manualClose");
                        }
                    }, function errorCallback(response) {
                        $rootScope.openToast("Datasource calculation save failed", 0, "manualClose");
                    });
            }


        }

        $scope.executeTest = function() {
            var DS_CALCULATION_PROPERTIES = {
                'dsVId': '',
                'elements': [],
                'orderAttrs': [],
                'defaultValues': []
            };
            var executeJSON = {
                'dsVId': '',
                'elements': [],
                'calScript': {},
                'locale': 'en-US'
            }
            angular.forEach($scope.datasource.eAr, function(datasource) {
                var element = {
                    'eid': datasource.eId,
                    'evalue': setNullToEmpty(datasource.gridPr.dv)
                }
                DS_CALCULATION_PROPERTIES.dsVId = $scope.dsVersionId;

                if (datasource.gridPr.typ === 'Calculation' || datasource.gridPr.typ === 'DataSource') {
                    DS_CALCULATION_PROPERTIES.elements.push({
                        'eid': datasource.eId,
                        'cscript': (typeof datasource.popPr === 'undefined') ? '' : datasource.popPr.calcTxt
                    });
                }
                executeJSON.elements.push(element);
            });
            angular.forEach($scope.datasource.dsOrderDetail, function(orderDetails) {
                var orderAttr = {
                    'oid': orderDetails.oid,
                    'okey': orderDetails.okey,
                    'dvalue': setNullToEmpty(orderDetails.dvalue)
                }
                DS_CALCULATION_PROPERTIES.orderAttrs.push(orderAttr);
            });
            executeJSON.calScript = DS_CALCULATION_PROPERTIES;
            $scope.executeTestData = {
                    'customerId': dsCustId,
                    'dsVersionId': dsVersionId,
                    'updateTransId': $scope.datasource.uTransId,
                    'json': executeJSON
                }
                //var check = JSHINT("return 1;",false);	
            console.log($scope.executeTestData);
            var jscheck = true;
            angular.forEach($scope.executeTestData.json.calScript.elements, function(calcTxt) {
                if (jscheck) {
                    jscheck = JSHINT(calcTxt.cscript, false);
                    if (!jscheck) {
                        $('#syntaxErrors').html('');
                        for (var i = 0; i < JSHINT.errors.length; i += 1) {
                            var eleIdForDisp = null;
                            var error_line = "";
                            var e = JSHINT.errors[i];
                            if (e) {
                                var mappingRow1 = "";
                                error_line = 'Lint at line ' + e.line + ' character ' +
                                    e.character + ': ' + e.reason;
                                error_line = error_line +
                                    ' at line \"' +
                                    (e.evidence || '').replace(
                                        /^\s*(\S*(\s+\S+)*)\s*$/, "$1") + '\"';
                                $scope.syntaxMessage = false; //$('#syntaxMessage').show();
                                if (eleIdForDisp != calcTxt.eid) {
                                    eleIdForDisp = calcTxt.eid;
                                    mappingRow1 = $('<tr>')
                                        .attr("width", "100%")
                                        .attr("height", "10%")
                                        .attr('id', ("trValinput" + calcTxt.eid));
                                    var mappingTd1 = $('<td>').attr("width", "50%").attr(
                                        "height", "50%").text(calcTxt.eid);
                                    var mappingTd2 = $('<td>').attr("width", "50%").attr("height", "50%");
                                    $(mappingRow1).append($(mappingTd1));
                                    $(mappingRow1).append($(mappingTd2));
                                }
                                var mappingInnerDiv = $('<div>').attr("width", "100%").text(error_line);
                                $(mappingTd2).append($(mappingInnerDiv));
                                $('#syntaxErrors').append($(mappingRow1));
                                // }

                                alert(error_line + '\n');
                            }
                            dsLoadPopupMessages();
                            break;
                        }
                    }
                }
            });
            if (jscheck) {
                console.log($scope.executeTestData);
                CalculationServices.calculationExecuteTest($scope.executeTestData)
                    .then(function successCallback(response) {
                        if (response.body.code === "201") {
                            $scope.resData = JSON.parse(response.body.responseData);
                            console.log($scope.resData);
                            angular.forEach($scope.datasource.eAr, function(datasource) {
                                var procVal = $scope.resData.outValue;
                                var output = procVal[datasource.eId];
                                if (typeof output !== 'undefined') {
                                    output = JSON.parse(output);
                                    console.log('outVal', output);
                                    if ("output" in output) {
                                        datasource.processedVal = setNullToEmpty(output["output"]);
                                    }
                                }
                            });
                            cdjsonCalResultFetched($scope.resData);
                            console.log($scope.resData);
                            $scope.executeTestCompleted = true;
                            $rootScope.openToast("Calculation Execute Test completed successfully", 3000, "autoClose");
                        } else {
                            $rootScope.openToast("Error in Calculation Execute Test", 0, "manualClose");
                        }
                    }, function errorCallback(response) {
                        $rootScope.openToast("Datasource calculation save failed", 0, "manualClose");
                    });
            }
        }

        function cdjsonCalResultFetched(result) {
            console.log('in cdjsonCalResultFetched');
            var processedValues = result['outValue'];
            var testResultStatus = false;
            clearMessageContent();

            for (var key in processedValues) {
                var processedOutputVal = JSON.parse(processedValues[key]);
                if (processedOutputVal.messages != null) {
                    var eleIdForDisp = null;
                    for (var key1 in processedOutputVal.messages) {
                        if (processedOutputVal.messages[key1].type == 'Functional Error') {
                            $scope.functionMessage = false; //$('#functionMessage').show();
                            var mappingRow1 = "";
                            var mappingTd2 = $('<td>').attr("width", "50%").attr(
                                "height", "50%");
                            if (eleIdForDisp != processedOutputVal.messages[key1].eid) {
                                eleIdForDisp = processedOutputVal.messages[key1].eid;
                                mappingRow1 = $('<tr>')
                                    .attr("width", "100%")
                                    .attr("height", "10%")
                                    .attr('id',
                                        ("trValinput" + processedOutputVal.messages[key1].eid));
                                var mappingTd1 = $('<td>').attr("width", "50%").attr(
                                    "height", "50%").text(
                                    processedOutputVal.messages[key1].ename);
                                $(mappingRow1).append($(mappingTd1));
                                $(mappingRow1).append($(mappingTd2));
                                testResultStatus = true;
                            }
                            var mappingInnerDiv = $('<div>').attr("width", "100%").text(
                                processedOutputVal.messages[key1].messageString);
                            $(mappingTd2).append($(mappingInnerDiv));
                            // mappingRow1 = $(("#trinput" + processedValues[key].eid));
                            // $(mappingRow1).append($(mappingTd2));
                            $('#functionErrors').append($(mappingRow1));
                        }
                    }
                    for (var key1 in processedOutputVal.messages) {
                        var eleIdForDisp = null;
                        if (processedOutputVal.messages[key1].type == 'System Error') {
                            $scope.systemMessage = false; //$('#systemMessage').show();
                            var mappingRow1 = "";
                            var mappingTd2 = $('<td>').attr("width", "50%").attr("height", "50%");
                            if (eleIdForDisp != processedOutputVal.messages[key1].eid) {
                                eleIdForDisp = processedOutputVal.messages[key1].eid;
                                mappingRow1 = $('<tr>')
                                    .attr("width", "100%")
                                    .attr("height", "10%")
                                    .attr('id', ("trValinput" + processedOutputVal.messages[key1].eid));
                                var mappingTd1 = $('<td>').attr("width", "50%").attr(
                                    "height", "50%").text(
                                    processedOutputVal.messages[key1].ename);
                                $(mappingRow1).append($(mappingTd1));
                                $(mappingRow1).append($(mappingTd2));
                                testResultStatus = true;
                            }
                            mappingInnerDiv = $('<div>').attr("width", "100%").text(
                                processedOutputVal.messages[key1].messageString);
                            $(mappingTd2).append($(mappingInnerDiv));
                            // mappingRow1 = $(("#trinput" + processedValues[key].eid));
                            // $(mappingRow1).append($(mappingTd2));
                            $('#systemErrors').append($(mappingRow1));
                        }
                    }
                }
            }
            if (testResultStatus) {
                dsLoadPopupMessages();
            } else {
                $scope.executeTestCompleted = true;
            }
        }

        function clearMessageContent() {
            $scope.syntaxMessage = true;
            $scope.systemMessage = true;
            $scope.functionMessage = true;
            $('#syntaxErrors').html('');
            $('#systemErrors').html('');
            $('#functionErrors').html('');
        }

        function setNullToEmpty(str) {
            return (str == null || str == undefined || str === "null") ? "" : str;
        }

        function dsLoadPopupMessages() {
            dsCenterPopupMessages();
            $("#dsCalcValidationMsg").fadeIn("slow");
        }

        function dsCenterPopupMessages() {
            // request data for centering
            var windowWidthCentre1 = document.body.clientWidth;
            var windowHeightCentre1 = document.body.clientHeight;

            var popupHeight1 = $("#dsCalcValidationMsg").height();
            var popupWidth1 = $("#dsCalcValidationMsg").width();
            // centering
            $("#dsCalcValidationMsg").css({
                "position": "absolute",
                "top": (windowHeightCentre1 / 2 - popupHeight1 / 2),
                "left": (windowWidthCentre1 / 2 - popupWidth1 / 2),
                "z-index": 99

            });

        }

        $scope.dsDisablePopupMessages = function() {
            $("#calculationpage").attr("disabled", '');
            $("#dsCalcValidationMsg").fadeOut("slow");
            $("#calCancel").removeAttr('disabled');
        };


        $scope.toggleJavascriptEditor = function() {
            var fmChk = document.getElementById("fmEditorChk").checked;
            if (fmChk) {
                $scope.fmEditor = true;
                alert('FM Editor is enabled!');
                cm.toTextArea();
                $scope.startCodeMirrorWithValidation();
                cm.save();
            } else {
                $scope.fmEditor = false;
                alert('FM Editor is disabled!');
                if (typeof cm !== 'undefined')
                    cm.toTextArea();
                $scope.startCodeMirrorWithoutValidation();
            }
        }

        $scope.showModal = function() {
            var modal = document.getElementById("myModal");
            modal.style.display = 'block';


            $scope.ok = function() {
                $scope.codeEraseFlag = false;
                angular.forEach($scope.datasource.eAr, function(dsElement) {
                    if (dsElement.eId === $("#calcTextSelect").val().replace(/string:/g, "")) {
                        if (dsElement.gridPr.isBlocklyCode === 'Y') {
                            dsElement.popPr.blocklyXml = '';
                            dsElement.gridPr.isBlocklyCode = 'N';
                        }
                    }
                });
                $scope.ruleFlag = false;
                modal.style.display = 'none';

            }
            $scope.cancel = function() {
                $scope.codeEraseFlag = true;
                modal.style.display = 'none';
            }
        }

        $scope.codeEraseFlag = true;
        $scope.startCodeMirrorWithoutValidation = function() {
            CodeMirror.commands.autocomplete = function(cm) {
                CodeMirror.showHint(cm, CodeMirror.javascriptHint, {
                    caseinsensitive: true,
                    userDefKeywords: !usrDefAutoComplete ? {} : usrDefAutoComplete,
                    appendKey: "fm.",
                    terminateWith: ";",
                    encloseWith: "\"\"",
                    jsonKey1: "usrStdFunc",
                    jsonKey2: "errocodes"
                });
            }
            cm = CodeMirror.fromTextArea(document.getElementById("caltextfield"), {
                lineNumbers: true,
                theme: "eclipse",
                extraKeys: { "Ctrl-Space": "autocomplete" },
                lineWrapping: true,
                viewportMargin: "300"
            });
            if ($scope.toggleClicked) {
                cm.setSize(1092, 447);
            } else {
                cm.setSize(640, 260);
            }
            cm.on("focus", function(createEvent) {
                $scope.executeTestCompleted = false;

                if ($scope.codeEraseFlag === true) {
                    angular.forEach($scope.datasource.eAr, function(dsElement) {
                        if (dsElement.eId === $("#calcTextSelect").val().replace(/string:/g, "")) {
                            if (dsElement.gridPr.isBlocklyCode === 'Y') {
                                setTimeout($scope.showModal());

                            }
                        }
                    });
                }

                $scope.$apply();
            });
        }

        $scope.startCodeMirrorWithValidation = function() {
            CodeMirror.commands.autocomplete = function(cm) {
                CodeMirror.showHint(cm, CodeMirror.javascriptHint, {
                    caseinsensitive: true,
                    userDefKeywords: !usrDefAutoComplete ? {} : usrDefAutoComplete,
                    appendKey: "fm.",
                    terminateWith: ";",
                    encloseWith: "\"\"",
                    jsonKey1: "usrStdFunc",
                    jsonKey2: "errocodes"
                });
            }
            cm = CodeMirror.fromTextArea(document.getElementById("caltextfield"), {
                lineNumbers: true,
                theme: "eclipse",
                mode: "javascript",
                lintWith: CodeMirror.javascriptValidator,
                gutters: ["CodeMirror-lint-markers"],
                extraKeys: { "Ctrl-Space": "autocomplete" },
                lineWrapping: true,
                viewportMargin: "300"
            });
            isReadOnly = true;
            if ($scope.toggleClicked) {
                cm.setSize(1092, 447);
            } else {
                cm.setSize(640, 260);
            }
        }

        // category 1 -> field/elements, 2-> funtions, 3 -> field/elements Add, 4-> funtions Add
        $scope.setCalculationTxt = function(category, replaceTxt) {
            var catSelected = $scope.categorySelected;
            var functionData = replaceTxt;
            if (category === 1) {
                selectedFieldValue = replaceTxt;
                if (cm.somethingSelected()) {
                    cm.replaceSelection("'" + replaceTxt + "'");
                }
            } else if (category === 2) {
                if (catSelected === "1" || catSelected === "5") {
                    CalculationServices.getSyntax(functionData.funcId).then(function successCallback(data) {
                        var funArr = [];
                        funArr = data.FParams;
                        var replaceTxt = 'fm.' + data.name + '(' + stringJoiner(funArr) + ');';
                        if (cm.somethingSelected()) {
                            cm.replaceSelection(replaceTxt);
                        }
                    });
                } else {
                    var replaceTxt = replaceTxt.syntax;
                    if (cm.somethingSelected()) {
                        cm.replaceSelection(replaceTxt);
                    }
                }
            } else if (category === 3) {
                if (cm.somethingSelected()) {
                    cm.replaceSelection("'" + replaceTxt + "'");
                } else {
                    var curPos = cm.getCursor();
                    cm.replaceRange("'" + replaceTxt + "'", curPos);
                }
                cm.focus();
            } else if (category === 4) {
                functionData = JSON.parse(functionData);
                if (catSelected === "1" || catSelected === "5") {
                    CalculationServices.getSyntax(functionData.funcId).then(function successCallback(data) {
                        var funArr = [];
                        funArr = data.FParams;
                        var replaceTxt = 'fm.' + data.name + '(' + stringJoiner(funArr) + ');';
                        if (cm.somethingSelected()) {
                            cm.replaceSelection(replaceTxt);
                        } else {
                            var curPos = cm.getCursor();
                            cm.replaceRange(replaceTxt, curPos);
                        }
                    });
                } else {
                    var replaceTxt = replaceTxt.syntax;
                    if (cm.somethingSelected()) {
                        cm.replaceSelection(replaceTxt);
                    } else {
                        var curPos = cm.getCursor();
                        cm.replaceRange(replaceTxt, curPos);
                    }
                }
                cm.focus();
            }
        }

        var stringJoiner = function(str) {
            funcStr = '';
            for (var i = 0; i < str.length; i++) {
                var param = str[i].name;
                if (funcStr === '') {
                    funcStr = funcStr + param;
                } else {
                    funcStr = funcStr + ',' + param;
                }
            }
            return funcStr;
        }

        $scope.toggleCalculationPage = function() {
            if ($scope.toggleClicked) {
                $scope.toggleClicked = false;
            } else {
                $scope.toggleClicked = true;
            }
            if ($scope.fmEditor) {
                cm.toTextArea();
                $scope.startCodeMirrorWithValidation();
                cm.save();
            } else {
                if (typeof cm !== 'undefined')
                    cm.toTextArea();
                $scope.startCodeMirrorWithoutValidation();
            }
        }


        $scope.setCalculationTxtDblClick = function(event) {
            event.preventDefault();
            console.log('dblclk');
            if (selectedFieldValue != "")
                cm.replaceSelection("'" + selectedFieldValue + "'");
            cm.focus();
        }


        $scope.loadDatasource();
        $scope.loadDatasourceFunctions();

        console.log("called");


        $scope.Cancel = function() {
            $mdDialog.hide();
            BlocklyTransferService.setCommentFlag(false);
        }

        //Toggle For Blockly
        $scope.blocklyFlag = false;

        _closingBlocklyPopUp = function() {
            $scope.blocklyFlag = false;
            $scope.switchTabView = true;
            // Blockly.mainWorkspace.clear();
        }
        $scope.switchTabView = BlocklyTransferService.getBlocklyTab();
        $scope.toggleTabView = function(tab) {
            let tmp = 'N';
            angular.forEach($scope.datasource.eAr, function(dsElement) {
                if (dsElement.eId === $("#calcTextSelect").val().replace(/string:/g, "")) {
                    tmp = dsElement.gridPr.isBlocklyCode;
                }
            });
            if (cm != undefined) {
                if (cm.getValue() == "" || tmp === "Y") {
                    $scope.switchTabView = tab === 'blockly' ? false : true;
                    $timeout(function() {
                        $rootScope.$emit("Initialize");
                    }, 200);
                    let str = 'datasource';
                    if ($scope.userSelectedFieldHtml.toLowerCase() == str)
                        BlocklyTransferService.setRuleLevel("Account Level");
                    else
                        BlocklyTransferService.setRuleLevel("Field Level");
                    $scope.blocklyFlag = true;
                    $scope.switchTabView = false;
                    let tempRule = {
                        "blocklyJs": "{}",
                        "blocklyXml": "",
                    }
                    angular.forEach($scope.datasource.eAr, function(dsElement) {
                        if (dsElement.eId === $("#calcTextSelect").val().replace(/string:/g, "")) {
                            tempRule.blocklyXml = dsElement.popPr.blocklyXml;
                            tempRule.blocklyJs = dsElement.popPr.calcTxt;
                            BlocklyTransferService.setRule(tempRule);
                        }
                    });
                } else {
                    $rootScope.openToast("Javascript is already present !", 0, "manualClose");
                }
            }

        }



        //Controller For Blockly Popup
        $scope.ruleDesc = '';
        $scope.descFlag = true;
        $scope.searchFlag = false;
        $scope.ruleName = '';
        $scope.tableFlag = false;
        $scope.globalFlag = false;
        $scope.blocklyVisibility = true;
        $scope.ruleNameHtml = '';
        $scope.ruleLevel = BlocklyTransferService.getRuleLevel();
        $scope.ruleDescHtml = '';
        $scope.fieldSelected = '';
        $scope.ruleSelected = [];
        $scope.blocklyData = {};
        $scope.pages = [
            { name: 20, value: 20 },
            { name: 50, value: 50 },
            { name: 100, value: 100 }
        ];
        $scope.pageSize = $scope.pages[0].value;
        $scope.currentPage = 1;
        $scope.switchTabView = BlocklyTransferService.getBlocklyTab();
        $scope.searchElementLevel = false;
        $scope.fields = [];
        $scope.fieldNames = [];
        $scope.RuleList = [];
        $scope.loadFields = function() {
            CalculationServices.getDatasource(dsVersionId)
                .then(function successCallback(data) {
                    $scope.ds = data.responseData;
                    angular.forEach($scope.ds.eAr, function(dsElement) {
                        let dsElem = {};
                        dsElem["eId"] = dsElement.eId;
                        dsElem["eNm"] = dsElement.gridPr.eNm;
                        $scope.fieldNames.push(dsElement.gridPr.eNm);
                        $scope.fields.push(dsElem);
                    });
                    BlocklyTransferService.setFields($scope.fieldNames);
                    $rootScope.$emit("Fields Ready");
                })
        }
        $scope.loadFields();
        $scope.loadFunctions = function() {
            CalculationServices.getAllFunctions()
                .then(function successCallback(data) {
                    BlocklyTransferService.setFunctions(data);
                    $rootScope.$emit("Functions Ready");
                })
        }
        $scope.loadFunctions();

        var obj = {};


        $scope.saveBlocks = function() {
            let ruleNameDuplicate = false;
            $scope.ruleLevel = BlocklyTransferService.getRuleLevel();
            if ($scope.globalFlag == true && $scope.ruleNameHtml != null && $scope.ruleDescHtml != null) {
                if ($scope.RuleList.length != 0) {
                    $scope.RuleList.forEach(rule => {
                        if (rule.ruleName === $scope.ruleNameHtml) {
                            ruleNameDuplicate = true;
                        }
                    })
                }
            }
            if ($scope.globalFlag == true && $scope.ruleNameHtml != null && $scope.ruleDescHtml != null && ruleNameDuplicate == false) {
                var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
                obj["ruleName"] = $scope.ruleNameHtml;
                obj["blocklyXml"] = Blockly.Xml.domToText(xml);
                obj["blocklyJs"] = Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace);
                obj["ruleDesc"] = $scope.ruleDescHtml;
                if ($scope.ruleLevel === 'Account Level') {
                    obj["rbcCode"] = dsCustId;
                    obj["rbcName"] = $scope.accountName;
                    console.log("DATA TO SAVE ===> " + JSON.stringify(obj));
                    if ($scope.isEditBlockly == true) {
                        obj["ruleId"] = $scope.ruleId;
                        LogicRefServices.editCustomerRule(obj)
                            .then(function successCallback(data) {
                                console.log("DATA ===> " + data);
                                $rootScope.openToast("Rule saved in Customer table!", 5000, "autoClose");
                                _closingBlocklyPopUp();
                            })
                    } else {
                        LogicRefServices.createCustomerRule(obj)
                            .then(function successCallback(data) {
                                console.log("DATA ===> " + data);
                                $rootScope.openToast("Rule saved in Customer table!", 5000, "autoClose");
                                _closingBlocklyPopUp();
                            })
                    }

                } else if ($scope.ruleLevel === 'Field Level') {
                    obj["fieldId"] = $("#calcTextSelect").val().replace(/string:/g, "");
                    console.log("DATA TO SAVE ===> " + JSON.stringify(obj));
                    if ($scope.isBlocklyCode == true) {
                        obj["ruleId"] = $scope.ruleId;
                        LogicRefServices.editFieldRule(obj)
                            .then(function successCallback() {
                                console.log("DATA ===> " + data);
                                $rootScope.openToast("Rule saved in Field table!", 5000, "autoClose");
                                _closingBlocklyPopUp();
                            })
                    } else {
                        LogicRefServices.createFieldRule(obj)
                            .then(function successCallback() {
                                console.log("DATA ===> " + data);
                                $rootScope.openToast("Rule saved in Field table!", 5000, "autoClose");
                                _closingBlocklyPopUp();
                            })
                    }

                }
            } else if ($scope.globalFlag == false && ruleNameDuplicate == false) {
                var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
                $scope.blocklyData["xml"] = Blockly.Xml.domToText(xml);
                $scope.blocklyData["js"] = Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace);
                if (typeof cm !== 'undefined') {
                    angular.forEach($scope.datasource.eAr, function(dsElement) {
                        if (dsElement.eId === $("#calcTextSelect").val().replace(/string:/g, "")) {
                            dsElement.popPr.calcTxt = $scope.blocklyData["js"];
                            dsElement.popPr.blocklyXml = $scope.blocklyData["xml"];
                            dsElement.gridPr.isBlocklyCode = 'Y';
                            $scope.ruleFlag = true;
                            cm.setValue($scope.blocklyData.js);

                        }
                    });
                }
                _closingBlocklyPopUp();
            }

        }

        $scope.cancelBlockly = function() {
            $scope.switchTabView = true;
            _closingBlocklyPopUp();
        }
        $scope.blocklyDescriptionFilling = function() {
            $scope.descFlag = false;
        }
        $scope.searchRule = function(createEvent) {
            if (document.getElementById("searchRuleCheckbox").checked == true) {
                $scope.ruleLevel = 'Account Level';
                $scope.onLoad();
                $scope.tableFlag = true;
            } else {
                $scope.tableFlag = false;
                $rootScope.$emit("Fields Ready");
                document.getElementById('elementCheckbox').checked = false;
                $scope.fieldSelected = "";
                $scope.ruleLevel = BlocklyTransferService.getRuleLevel();
                //$scope.onLoad();
            }
        }


        $scope.onLoad = function() {
            if ($scope.ruleLevel === 'Account Level') {
                LogicRefServices.getAllCustomerRules()
                    .then(function successCallback(data) {
                        $scope.RuleList = [];
                        console.log(data);
                        data.forEach(element => {
                            var tempObj = {};
                            tempObj['ruleId'] = element.customerRuleId;
                            tempObj['ruleName'] = element.ruleName;
                            tempObj['ruleDesc'] = element.ruleDesc;
                            tempObj['blocklyJs'] = element.blocklyJs;
                            tempObj['blocklyXml'] = element.blocklyXml;
                            if (element.customer != null) {
                                tempObj['rbcCode'] = element.customer.rbcCode;
                                tempObj['rbcName'] = element.customer.name;
                            } else {
                                tempObj['rbcCode'] = "";
                                tempObj['rbcName'] = "";
                            }
                            $scope.RuleList.push(tempObj);
                        });
                    })
            } else if ($scope.ruleLevel === 'Field Level') {
                LogicRefServices.getAllFieldRules()
                    .then(function successCallback(data) {
                        $scope.RuleList = [];
                        console.log(data);
                        data.forEach(element => {
                            var tempObj = {};
                            tempObj['ruleId'] = element.fieldRuleId;
                            tempObj['ruleName'] = element.ruleName;
                            tempObj['ruleDesc'] = element.ruleDesc;
                            tempObj['blocklyJs'] = element.blocklyJs;
                            if (element.field != null) {
                                tempObj['fieldName'] = element.field.fieldName;
                            } else {
                                tempObj['fieldName'] = "";
                            }
                            $scope.RuleList.push(tempObj);
                        });
                    })
            } else if ($scope.ruleLevel === 'Single Field') {
                LogicRefServices.getAllFieldRulesByFieldId($scope.fieldId)
                    .then(function successCallback(data) {
                        $scope.RuleList = [];
                        data.forEach(element => {
                            var tempObj = {};
                            tempObj['ruleId'] = element.fieldRuleId;
                            tempObj['ruleName'] = element.ruleName;
                            tempObj['ruleDesc'] = element.ruleDesc;
                            tempObj['blocklyJs'] = element.blocklyJs;
                            if (element.field != null) {
                                tempObj['fieldName'] = element.field.fieldName;
                            } else {
                                tempObj['fieldName'] = "";
                            }
                            $scope.RuleList.push(tempObj);
                        });
                    })
            }
        }
        $scope.onLoad();

        $scope.tableShowEdit = function(editEvent) {
            editEvent.currentTarget.children[0].children[0].style.visibility = "visible";
        };

        $scope.tableHideEdit = function(editEvent) {
            editEvent.currentTarget.children[0].children[0].style.visibility = "hidden";
        };

        $scope.searchClose = function(type) {
            if (type === "ruleName") {
                $scope.searchRuleName = "";
            } else if (type === "ruleDesc") {
                $scope.searchRuleDesc = "";
            } else if (type === "accountName") {
                $scope.searchAccountName = "";
            } else if (type === "accountCode") {
                $scope.searchAccountCode = "";
            } else if (type === "fieldName") {
                $scope.searchFieldName = "";
            } else if (type === "javaScript") {
                $scope.searchJavascript = "";
            }
        }

        $scope.searchOnField = function(field) {
            var e = document.getElementById("fieldDropdownHtml");
            var strUser = e.options[e.selectedIndex].text;
            angular.forEach($scope.datasource.eAr, function(dsElement) {
                if (dsElement.gridPr.eNm === strUser) {
                    $scope.fieldId = dsElement.eId;
                }
            });
            console.log($scope.fieldSelected);
            if ($scope.elementCheckedFlag == true) {

                $scope.ruleLevel = 'Single Field';
                $scope.onLoad();
            } else {
                $rootScope.openToast("Please select element level to view field level rules!", 0, "manualClose");
            }

        }

        $scope.showElementChecked = function() {
            if (document.getElementById('elementCheckbox').checked == true) {
                $scope.elementCheckedFlag = true;
                $scope.ruleLevel = 'Field Level';
                $scope.onLoad();
            } else {
                $scope.elementCheckedFlag = false;
                $scope.ruleLevel = 'Account Level';
                document.getElementById('fieldDropdownHtml').selectedIndex = 0;
                $scope.onLoad();
            }
        }
        $scope.selectRule = function(rule) {
            let presentFlag = false;
            $scope.ruleSelected.forEach(ele => {
                if (ele === rule.ruleId) {
                    presentFlag = true;
                    $scope.ruleSelected.splice($scope.ruleSelected.indexOf(rule.ruleId), 1);
                }
            })
            if (presentFlag == false)
                $scope.ruleSelected.push(rule.ruleId);
            console.log('Rule Selected => ' + JSON.stringify($scope.ruleSelected));
        }
        $scope.addRule = function() {
            if ($scope.ruleSelected.length != 1) {
                $rootScope.openToast("Please check 1 rule!", 0, "manualClose");
                return;
            } else {
                $rootScope.openToast("Rule Added to you workspace!", 5000, "autoClose");
                $scope.tableFlag = false;
                var ruleAddition = {};
                var filtered = $scope.RuleList.filter(function(value) {
                    return value.ruleId === $scope.ruleSelected[0]
                });
                BlocklyTransferService.setRule(filtered[0]);


                document.getElementById("searchRuleCheckbox").checked = false;
            }
        }
        $scope.replaceRule = function() {
            if ($scope.ruleSelected.length != 1) {
                $rootScope.openToast("Please check only 1 rule!", 0, "manualClose");
                return;
            } else {
                $rootScope.openToast("Rule replaced your current workspace!", 5000, "autoClose");
                $scope.tableFlag = false;
                document.getElementById("searchRuleCheckbox").checked = false;
                document.getElementById($scope.ruleLevel + ruleAddition.ruleId).checked = false;
            }
        }
        $scope.makeGlobalRule = function() {
            if (document.getElementById('globalRuleCheckbox').checked == true) {
                $scope.globalFlag = true;
            } else {
                $scope.globalFlag = false;
            }
        }

        //Adding a watcher 
        $scope.$watch('tableFlag', function(newVal, oldVal) {
            if (!newVal)
                $timeout(function() {
                    $rootScope.$emit("ImportXML");
                }, 200)
        })

        $scope.cancel1 = function() {
            $scope.tableFlag = false;
            document.getElementById("searchRuleCheckbox").checked = false;
            document.getElementById("elementCheckbox").checked = false;
            $scope.fieldSelected = "";
            $rootScope.$emit("Fields Ready");
        }
        $scope.switchToBlockly = function() {
            $scope.blocklyVisibility = true;
        }

        $scope.switchToJs = function() {
                $scope.blocklyVisibility = false;
            }
            // }
        function CommentController($scope, $mdDialog, $rootScope, LogicRefServices, BlocklyTransferService) {
            $scope.newCommentHtml = '';
            $scope.CommentList = [];
            $scope.displayCommentList = [];
            LogicRefServices.getComment(2)
                .then(function successCallback(data) {
                    console.log(JSON.stringify(data));
                    if (data != null) {

                        $scope.CommentList = JSON.parse(JSON.stringify(data.comments.comments));
                        $scope.displayCommentList = JSON.parse(JSON.stringify(data.comments.comments));

                        angular.forEach($scope.displayCommentList, function(comment) {
                            let diff = (new Date().getTime() - comment.timestamp) / 86400000;
                            diff = parseFloat(diff).toFixed(0);
                            comment.timestamp = diff;
                        })
                    }
                })
            $scope.closeComment = function() {
                $mdDialog.cancel();
            }
            $scope.saveComment = function() {
                if ($scope.newCommentHtml != null || $scope.newCommentHtml.length > 0) {
                    let obj = {};
                    obj["comment"] = $scope.newCommentHtml;
                    obj["name"] = $cookies.get("DW_LOGGEDIN_USER");
                    let d = new Date();
                    obj["timestamp"] = d.getTime();
                    $scope.CommentList.push(obj);
                    let voObj = {};
                    let tempObj = {};
                    tempObj["comments"] = $scope.CommentList;
                    voObj["comments"] = tempObj;
                    voObj["versionId"] = '2';

                    LogicRefServices.saveComment(voObj)
                        .then(function(data) {
                                console.log("Save Comment Status ==> " + data);
                                BlocklyTransferService.setCommentFlag(true);
                                $rootScope.openToast("Comment has been saved!", 5000, "autoClose");
                                $scope.closeComment();
                            },
                            function errorCallback(data) {
                                console.log("ERROR MESSAGE ==> " + data);
                                $rootScope.openToast("Comment could not be saved!", 0, "manualClose");
                                $scope.closeComment();
                            })
                    $scope.newCommentHtml = '';

                } else {
                    $rootScope.openToast("Please add comment to save rule!", 0, "manualClose");
                }
            }
        }
    }

    var versionIdPromoteDs = "";
    var descriptionPromoteDs = "";
    $scope.createnewdatasource = function() {
        console.log($scope.datasetDetail);
        var saveRulesList = [];
        angular.forEach($scope.datasetDetail.eAr, function(dsElement) {
            if (dsElement.gridPr.ruleId != undefined && dsElement.gridPr.ruleId != "null") {
                saveRulesList.push(dsElement.ruleSelected);
            }
        })
        delete $scope.datasetDetail["disable"];
        angular.forEach($scope.datasetDetail.eAr, function(fieldlist) {
            Object.keys(fieldlist).forEach(function(key) {
                if (key == "sequence") {
                    delete fieldlist[key];
                }
                if (key == "disable") {
                    delete fieldlist[key];
                }
                if (key == "ischecked") {
                    delete fieldlist[key];
                }

            });
        });
        for (var i = 0; i < $scope.datasetDetail.eAr.length; i++) {
            if ($scope.datasetDetail.eAr[i].gridPr.eNm == "" || $scope.datasetDetail.eAr[i].gridPr.eNm == null) {
                $scope.datasetDetail.eAr.splice(i, 1);
                i = i - 1;
            }
        }
        var validationcheckforproperties= false;
		for(var i=0;i<$scope.datasetDetail.eAr.length;i++){
			if($scope.datasetDetail.eAr[i].gridPr.typ == "Lookup" || $scope.datasetDetail.eAr[i].gridPr.typ == "List Box" || $scope.datasetDetail.eAr[i].gridPr.typ == "Image List"){
				if($scope.datasetDetail.eAr[i]["popPr"] == undefined || $scope.datasetDetail.eAr[i]["popPr"] == null){
					$scope.datasetDetail.eAr[i]["popPr"] ={};
				}
					if(Object.keys($scope.datasetDetail.eAr[i].popPr).length == 0){
						validationcheckforproperties = true;
						$rootScope.openToast("Properties are mandatory for Lookup,List Box and Image List", 0, "manualClose");
						return ;
					}
				
			}
		}
        var finaljson = "";
        if(validationcheckforproperties == false){
        if ($scope.isedit == true) {
            var editdetails = localStoreService.get('editdatasetdetails');
            $scope.datasetDetail.dbOp = "";
            if (editdetails == undefined) {
                editdetails = {};
                editdetails["versionId"] = $scope.datasetDetail.dsVid;
            }
            var editjson = {
                customerId: $scope.RBCCode,
                dsElementIdsCSV: "",
                dsVersionId: $scope.datasetDetail.dsVid,
                json: JSON.stringify($scope.datasetDetail)
            };
            finaljson = editjson;
        } else {
            $scope.datasetDetail.dVerNo = "";
            $scope.datasetDetail.dVerStat = "";
            var createjson = {
                customerId: $scope.RBCCode,
                dsElementIdsCSV: "",
                dsVersionId: "",
                json: JSON.stringify($scope.datasetDetail)
            };
            finaljson = createjson;
        }
        angular.forEach($scope.datasetDetail.eAr, function(dsElement) {
            console.log(dsElement);
        })
        CalculationServices.saveRuleCalculation(saveRulesList)
            .then(function successCallback() {
                $rootScope.openToast("Selected Rules saved successfully !", 3000, "autoClose");
                DataSourceService.SaveDatasource(finaljson)
                    .then(function successCallback(response) {
                        console.log("SaveDatasource_++++++++++++++", response);
                        SaveFlag = true;
                        ViewSaveCounter++;
                        SaveViewUpdateDeleteGlobal = response;
                        VersionGlobal = response.dsVid;
                        $rootScope.saveDataSource = response;
                        SaveDatasourceGlobal = response;
                        SaveDatasourceDescription = response;
                        viewDataSourceGlobal = response;
                        versionIdPromoteDs = response.dsVid;
                        descriptionPromoteDs = response.dDsc;
                        $rootScope.DatSourcedNm = response.dNm;
                        $rootScope.DatSourcedsVid = response.dsVid;
                        $rootScope.DatSourceuTransId = response.uTransId;
                        $rootScope.DatSourcedVerNo = response.dVerNo
                        if (response.type == 'error') {
                            $rootScope.openToast(response.text, 0, "manualClose");
                        } else {

                            $scope.isedit = true;
                            $scope.datasetDetail = response;
                            $scope.datasetDetail.dbOp = "";
                            $scope.verno = [];
                            $scope.verno.push($scope.datasetDetail.dVerNo.toString());
                            var i = 0;
                            angular.forEach($scope.datasetDetail.eAr, function(attribute) {
                                attribute['sequence'] = i + 1;
                                attribute['ischecked'] = false;
                                attribute['disable'] = 'true';
                                attribute.dbOp = "U";
                            });
                            //for blockly dropdown intitialization
                            angular.forEach($scope.datasetDetail.eAr, function(dsElement) {
                                if (dsElement.gridPr.typ == 'Calculation') {
                                    LogicRefServices.getAllFieldRulesByFieldId(dsElement.gridPr.fId)
                                        .then(function successCallback(data) {
                                            dsElement["rules"] = data;
                                            $scope.RuleList = data;
                                        })
                                }
                            })
                            console.log($scope.RuleList);
                            if($scope.RuleList != undefined){
                                angular.forEach($scope.datasetDetail.eAr, function(dsElement) {
                                    if (dsElement.gridPr.ruleId != undefined && dsElement.gridPr.ruleId != "null") {
                                        angular.forEach($scope.RuleList, function(rule){
                                                    if(rule.fieldRuleId == dsElement.gridPr.ruleId){
                                                        let tempObj = {};
                                                        tempObj["eid"] = dsElement.eId;
                                                        tempObj["ruleId"] = rule.fieldRuleId;
                                                        tempObj["blocklyJs"] = rule.blocklyJs;
                                                        tempObj["blocklyXml"] = rule.blocklyXml;
                                                        dsElement["ruleSelected"] = tempObj;
                                                        dsElement["ruleTxt"] = rule.ruleName;
                                                    }
                                                })
                                    }
                                })
                            }
                            if ($scope.datasetDetail.dO.std == undefined) {
                                $scope.datasetDetail.dO["std"] = {};
                            }
                            if ($scope.datasetDetail.dO.call == undefined) {
                                $scope.datasetDetail.dO["call"] = {};
                            }
                            if ($scope.datasetDetail.dO.legy == undefined) {
                                $scope.datasetDetail.dO["legy"] = {};
                            }
                            if ($scope.datasetDetail.dO.custdocs == undefined) {
                                $scope.datasetDetail.dO["custdocs"] = {};
                            }
                            if ($scope.datasetDetail.dO.skurefer == undefined) {
                                $scope.datasetDetail.dO["skurefer"] = {};
                            }
                            buttonvalidations();


                            $rootScope.openToast(response.text, 3000, "autoClose");
                            $scope.disablePromote = false;
                            /* code added by Gaurav to handle Back button issue */
                            localStoreService.store("editdataset", true);
                            let editdatasetdetails = {};
                            editdatasetdetails['versionId'] = response.dsVid;
                            localStoreService.store("editdatasetdetails", editdatasetdetails);
                            /* End of code added by Gaurav to handle Back button issue */
                        }
                        $window.scrollTo(0, 0);
                    }, function errorCallback(response) {
                        $rootScope.openToast("Datasource creation failed", 0, "manualClose");
                        $window.scrollTo(0, 0);
                    });
            }, function errorCallback(response) {
                $rootScope.openToast(response.text, 0, "manualClose");
            })
        }
    };

    // Code to create Fiber content (Author: Bhavana)
    //function to create Fiber Content popup
    $scope.createFC = function() {
        $mdDialog.show({
                controller: 'CreateFCCtrl',
                templateUrl: 'html/dw/evdp/CreateFiberContent.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                hasBackdrop: false,
                locals: { parentScope: $scope }
            })
            .then(function() {

            }, function() {

            });
    }

    //function to create Care instructions popup
    $scope.createCareInstruction = function() {
            $mdDialog.show({
                    controller: 'CreateCareInstructionCtrl',
                    templateUrl: 'html/dw/evdp/CreateCareInstPopup.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    hasBackdrop: false,
                    locals: { parentScope: $scope }
                })
                .then(function() {

                }, function() {

                });
        }
        /*------End of code (Bhavana)-----------*/

    // helptext code
    $scope.showhelptext = function($event, currentMasterAttributes) {
        $event.preventDefault();
        $scope.selectedFieldObj = currentMasterAttributes;
        $mdDialog.show({
            locals: { dataToPass: $scope },
            controller: Helptextcontroller,
            templateUrl: 'html/dw/evdp/HelpTextPrompt.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        }).then(function() {

        }, function(error) {
            console.log(error);
        });
    }

    function Helptextcontroller($scope, $mdDialog, dataToPass) {
        var selectedattribute = dataToPass.selectedFieldObj;
        var parentscope = dataToPass;
        $scope.savecheck = false;
        $scope.helptxtobj = [];
        if (parentscope.selectedFieldObj.helptxtPr != "" && parentscope.selectedFieldObj.helptxtPr != undefined) {
            if (Object.keys(selectedattribute.helptxtPr).length > 0) {
                var length = selectedattribute.helptxtPr["helptxt"].length;
                for (var i = 0; i < length; i++) {
                    $scope.helptxtobj.push({
                        "helptxt": selectedattribute.helptxtPr["helptxt"][i],
                        "prmpt": selectedattribute.helptxtPr["prmpt"][i],
                        "lcl": selectedattribute.helptxtPr["lcl"][i]
                    });
                }
            }
        } else {
            $scope.helptxtobj.push({
                "helptxt": "",
                "prmpt": "",
                "lcl": ""
            });
        }
        $scope.localelist = [];
        $scope.onload = function() {
            DataSourceService.gethelptextlocale(parentscope.RBCCode, selectedattribute.eId).then(
                function(data) {
                    if (Object.keys(data.localeLst).length != 0) {
                        var localelist = data.localeLst;
                        angular.forEach(localelist, function(item) {
                            var local = Object.keys(item);
                            $scope.localelist.push({
                                id: local[0],
                                name: item[local[0]]
                            });
                        });
                    }
                    if (selectedattribute.helptxtPr == undefined) {
                        selectedattribute.helptxtPr = "";
                    }
                    if (Object.keys(selectedattribute.helptxtPr).length == 0) {
                        if (Object.keys(data.localeDt).length > 0) {
                            $scope.helptxtobj = [];
                            var length = data.localeDt.length;
                            for (var i = 0; i < length; i++) {
                                $scope.helptxtobj.push({
                                    "helptxt": data.localeDt[i][0],
                                    "prmpt": data.localeDt[i][1],
                                    "lcl": data.localeDt[i][2]
                                });
                            }
                        }
                    }
                },
                function(errorMessage) {
                    console.log('error');
                });
        };
        $scope.addrow = function($event) {
            $event.preventDefault();
            var obj = {
                "helptxt": "",
                "prmpt": "",
                "lcl": ""
            };
            $scope.helptxtobj.push(obj);
        };
        $scope.cancel = function() {
            $mdDialog.hide();
        };
        $scope.Savehelptext = function() {
            var helptxt = [];
            var prompt = [];
            var locale = [];
            var duplicatecheck = hasduplicateslocale();
            if (duplicatecheck == false) {
                $scope.savecheck = false;
                angular.forEach($scope.helptxtobj, function(item) {
                    helptxt.push(item.helptxt);
                    prompt.push(item.prmpt);
                    locale.push(item.lcl);
                });
                parentscope.selectedFieldObj.helptxtPr = {
                    "helptxt": helptxt,
                    "prmpt": prompt,
                    "lcl": locale
                };
                $mdDialog.hide();
            } else {
                $scope.savecheck = true;
            }

        };
        $scope.onload();
        $scope.tableShowEdit = function(editEvent) {
            editEvent.currentTarget.children[3].children[0].style.visibility = "visible";
        };

        $scope.tableHideEdit = function(editEvent) {
            editEvent.currentTarget.children[3].children[0].style.visibility = "hidden";
        };
        $scope.deletehelptext = function(item, index) {
            $scope.helptxtobj.splice(index, 1);
        };

        function hasduplicateslocale() {
            var hash = Object.create(null);
            return $scope.helptxtobj.some(function(a) {
                return a.lcl && (hash[a.lcl] || !(hash[a.lcl] = true));
            });
        };
    }

    // ends

    var statusFlag = "";
    var promoteData;
    var promoteValues;
    var promoteDSListArray = {};
    $scope.promoteDs = function() {
        statusFlag = '';
        //console.log($scope.promoteData);
        var details = localStoreService.get('editdatasetdetails');
        console.log("details+++++++++++++++++++++++++++++", details);
        console.log(details);

        // if($scope.promoteData !=null && $scope.promoteData != undefined){
        if (!localStoreService.get("flagPromote")) {
            let editdatasetdetails = localStoreService.get('editdatasetdetails');
            promoteDSListArray = {
                "action": "promote",
                //"versionId":$scope.promoteData.versionId,
                //"promotionText":$scope.promoteData.description,
                "versionId": versionIdPromoteDs ||  editdatasetdetails['versionId'],
                "promotionText": descriptionPromoteDs,
                "implicit": false
            }
            console.log("Newly created Datasource, versionId--->>>>>" + versionIdPromoteDs);
            console.log("Newly created Datasource, promotionText--->>>>>" + descriptionPromoteDs);
        } else {
            promoteDSListArray = {
                "action": "promote", //"action":details.action,   
                "versionId": details.versionId,
                "promotionText": $scope.datasetDetail.dDsc, //details.promotionText, 
                "implicit": false
            }
            console.log("Existing Datasource, details.versionId--->>>>>" + details.versionId);
            console.log("Existing Datasource, details.promotionText--->>>>>" + $scope.datasetDetail.dDsc);
        };

        $scope.showSpinner = true;
        console.log(promoteDSListArray);

        if ($scope.datasetDetail.dVerStat == "WIP" || $scope.datasetDetail.dVerStat == "wip") {
            //if(details.dVerStat =="WIP" || details.dVerStat =="wip") {
            DataSourceService.getDataSourceDependents(promoteDSListArray).then(
                function successCallback(response) {
                    if (response.type == "warning" && response.code == 200) {
                        showProjectValidationDispModePopup(response.text);
                        return;
                    }

                    console.log(response);
                    promoteData = response.responseData;
                    //promoteData=1;
                    promoteValues = response.values;
                    $scope.showSpinner = false;
                    if ((promoteData == '' || promoteData == null || promoteData == undefined || promoteData == "success")) {
                        datasetDetails.dVerStat = "TEST";
                        $scope.datasetDetail.dVerStat = "TEST";
                        $rootScope.openToast("Promotion successfull. An email would be triggered with syncstatus of the resource if applicable.", 5000, "autoClose");
                        //$scope.onload();  
                    } else {
                        statusFlag = "TEST";
                        dependencyPopup();
                    }

                },
                function errorCallback(errorMessage) {
                    $rootScope.openToast("Datasource Promote error", 0, "manualClose");
                    $window.scrollTo(0, 0);
                    console.log("Datasource Promote error" + errorMessage);
                    $scope.showSpinner = false;
                });
        } else if ($scope.datasetDetail.dVerStat == "TEST" || $scope.datasetDetail.dVerStat == "test") {
            $scope.testToPendingPopup();
        }

    };

    $scope.testToPendingPopup = function() {
        $mdDialog.show({
            controller: TestToPendingPopupController,
            templateUrl: 'html/dw/evdp/TestToPendingPopup.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { parentScope: $scope }
        }).then(function() {

        }, function() {

        });
    };



    function TestToPendingPopupController($scope, $mdDialog, parentScope) {
        $scope.promoteDescr = {
            descr: ""
        };
        $scope.dependencyData = promoteData;
        //$scope.status = $scope.datasetDetail.dVerStat;
        $scope.status = details.dVerStat;

        $scope.cancel = function() {
            $mdDialog.cancel();
        }
        $scope.fun = function(promoteDescr) {
            $scope.promoteDescr = promoteDescr;
        }

        $scope.testToPendingControllerPromote = function() {
            statusFlag = '';
            console.log($scope.promoteDescr.descr)
            promoteDSListArray.promotionText = $scope.promoteDescr.descr;
            $mdDialog.cancel();

            DataSourceService.getDataSourceDependents(promoteDSListArray).then(
                function successCallback(response) {
                    if (response.type == "warning" && response.code == 200) {
                        //alert(response.text);
                        showProjectValidationDispModePopup(response.text);
                        return;
                    }

                    console.log(response);
                    promoteData = response.responseData;
                    promoteValues = response.values;
                    $scope.showSpinner = false;
                    //promoteData=1;
                    if ((promoteData == '' || promoteData == null || promoteData == undefined || promoteData == "success")) {
                       	datasetDetails.dVerStat = "PENDING";
			//$scope.datasetDetail.dVerStat = "PENDING";
			parentScope.datasetDetail.dVerStat = "PENDING";
			//alert("parentScope.datasetDetail.dVerStat ===>>"+parentScope.datasetDetail.dVerStat);
                        $rootScope.openToast("Promotion successfull. An email would be triggered with syncstatus of the resource if applicable.", 5000, "autoClose");
                        //$scope.onload();     
                    } else {
                        statusFlag = "PENDING";
                        dependencyPopup();
                    }

                },
                function errorCallback(errorMessage) {
                    $rootScope.openToast("Datasource Promote error", 0, "manualClose");
                    $window.scrollTo(0, 0);
                    console.log("Datasource Promote error" + errorMessage);
                    $scope.showSpinner = false;
                });

        }

    }

    var dependencyPopup = function() {
        $mdDialog.show({
            controller: PromoteController,
            templateUrl: 'html/dw/evdp/DatasourcePromotePopup.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { parentScope: $scope }
        }).then(function() {

        }, function() {

        });
    };

    function PromoteController($scope, $mdDialog, parentScope) {
        $scope.dependencyData = promoteData;
        // abc= xyz.datasetDetail
        //$scope.status = $scope.datasetDetail.dVerStat;
        $scope.status = parentScope.datasetDetail.dVerStat;

        $scope.cancel = function() {
            $mdDialog.cancel();
        }

        $scope.promote = function() {
            //promoteValues.promotionText = $scope.promoteDescr.descr;
            $mdDialog.cancel();

            DataSourceService.getDataSourceDependents(promoteValues).then(
                function successCallback(response) {
                    if (response.type == "warning" && response.code == 200) {
                        showProjectValidationDispModePopup(response.text);
                        return;
                    }
                    datasetDetails.dVerStat = statusFlag;
                    parentScope.datasetDetail.dVerStat = statusFlag;
		    //parentScope.datasetDetail.dVerStat = statusFlag;
                    $rootScope.openToast("Promotion successfull. An email would be triggered with syncstatus of the resource if applicable.", 5000, "autoClose");
                    statusFlag = '';
                    //$scope.onload(); 

                },
                function errorCallback(response) {
                    $rootScope.openToast("Datasource promotion failed", 0, "manualClose");
                    $window.scrollTo(0, 0);
                });
        }

    }
    //Add Look up pop up

    var staticFields2=[];
    $scope.addPopup = function(createEvent, viewEdit, indexToedit) {
        $window.scrollTo(0, 0);
        $mdDialog.show({
                controller: LookupDataSourceController,
                templateUrl: 'html/dw/evdp/LookupDataSource.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: { parentScope: $scope, viewEdit: viewEdit, indexToedit: indexToedit }
            })
            .then(function() {

            }, function(error) {
                console.log(error);
            });
    }

    function LookupDataSourceController($scope, $mdDialog, $rootScope, parentScope, viewEdit, indexToedit) {
        if (viewEdit == 0) {
            $scope.changeLkp = true;
            $scope.changedropdown=true;
        } else if (viewEdit == 1) {
            $scope.changeLkp = false;
            $scope.changedropdown=true;
        }
        let detailDS = parentScope.datasetDetail;
        $scope.cancel = function() {
            $mdDialog.cancel();
        }
        $scope.ShowModal2 = function() {
            if (viewEdit == 0) {
                $scope.cancel();
                return;
            }
            var modal2 = document.getElementById('myModal2');
            modal2.style.display = "block";
            $scope.cancel2 = function() {
                modal2.style.display = "none";
            }
            $scope.ok2 = function() {
                modal2.style.display = "none";
                $scope.cancel();
            }
        }
        console.log(localStoreService.get("customerIdFromFM"));
        $scope.selectedRbc = localStoreService.get("rbcSelectedDataSource");
        $scope.showSpinner = true;
        var lookupNameArr1 = [];
        let details1 = localStoreService.get('editdatasetdetails');
        CalculationServices.getDatasource(details1['versionId']).then(
            function successCallback(response) {
                let staticFields=response.responseData.dsOrderDetail;
                let datasourceLocal = response.responseData.eAr;
                angular.forEach(datasourceLocal, function(dsElement) {
                    if (dsElement.gridPr.typ === 'DataSource') {
                        datasourceLocal.unshift((datasourceLocal.splice(datasourceLocal.indexOf(dsElement), 1))[0]);
                    }
                });
                $scope.staticFields1=[];
                for(let i=0;i<staticFields.length;i++)
                {
                    staticFields2.push({"orderKey":true,"eId":staticFields[i].oid,"gridPr":{"eNm":staticFields[i].okey}});
                }
                $scope.staticFields1=angular.copy(staticFields2);
                $scope.datasource = angular.copy(datasourceLocal);
                console.log($scope.datasource);
                $scope.dataSourceOutput = $scope.datasource.filter(data1 => (data1.gridPr.typ == "Lookup" || data1.gridPr.typ == "LinkedList"));
                console.log($scope.dataSourceOutput);
            },
            function errorCallback(response) {
                $rootScope.openToast("An error occurred, please try again.", 0, "manualClose");
            });

        DataSourceService.getdatasourceLookupData(localStoreService.get("customerIdFromFM")).then(
            function successCallback(response) {
                if (response.type == "success") {
                    if (response.responseData.lookupList.length > 0) {
                        $scope.LookupPopupDiv = true;
                        console.log(response);
                        $scope.lookupNameArr = response.responseData.lookupList;
                        lookupNameArr1 = $scope.lookupNameArr;
                        if (viewEdit == 2) {
                            $scope.selectedLookup = $scope.lookupNameArr[0].id;
                            $scope.lookupDesc = $scope.lookupNameArr[0].desc;
                        } else {
                            let objAr1 = lookupNameArr1.filter(obj => obj.fName == detailDS.lAr[indexToedit].lNm);
                            $scope.selectedLookup = lookupNameArr1[lookupNameArr1.indexOf(objAr1[0])].id;
                            $scope.lookupDesc = lookupNameArr1[lookupNameArr1.indexOf(objAr1[0])].desc;
                        }
                        $scope.getLookupMapping();
                    } else {
                        $scope.showSpinner = false;
                        $rootScope.openToast("No data Lookup", 0, "manualClose");
                    }

                } else {
                    $scope.showSpinner = false;
                    $rootScope.openToast("No data Lookup", 0, "manualClose");
                }
            },
            function errorCallback(response) {
                $rootScope.openToast("An error occurred, please try again.", 0, "manualClose");
            });
        var returnList = [];
        $scope.getLookupMapping = function() {
            returnList = lookupNameArr1.filter(function(el) {
                return el.id == $scope.selectedLookup;
            });
            $scope.lookupDesc = lookupNameArr1[lookupNameArr1.indexOf(returnList[0])].desc;
            DataSourceService.getdatasourceLookupFieldsData($scope.selectedLookup).then(
                function successCallback(response) {
                    $scope.showSpinner = false;
                    if (response.type == "success") {
                        let inputList = [];
                        let outputList = [];
                        let listMap = response.responseData.lookupfieldsList;
                        if (listMap.length > 0) {
                            for (let i = 0; i < listMap.length; i++) {
                                if (listMap[i].fFlag == "I") {
                                    inputList.push(listMap[i]);
                                }
                                if (listMap[i].fFlag == "O") {
                                    outputList.push(listMap[i]);
                                }
                            }
                        }
                        if (viewEdit != 2) {
                            for (let i = 0; i < detailDS.lAr[indexToedit].inMapAr.length; i++) {
                                let objAr = inputList.filter(obj => obj.id == detailDS.lAr[indexToedit].inMapAr[i].lkpFldId);
                                inputList[inputList.indexOf(objAr[0])]["elId"] = detailDS.lAr[indexToedit].inMapAr[i].eId;
                            }
                            for (let i = 0; i < detailDS.lAr[indexToedit].outMapAr.length; i++) {
                                let objAr = outputList.filter(obj => obj.id == detailDS.lAr[indexToedit].outMapAr[i].lkpFldId);
                                outputList[outputList.indexOf(objAr[0])]["elId"] = detailDS.lAr[indexToedit].outMapAr[i].eId;
                            }
                        }
                        $scope.inputList = inputList;
                        $scope.outputList = outputList;
                    } else {
                        $rootScope.openToast("An error occurred, please try again.", 0, "manualClose");
                    }
                },
                function errorCallback(response) {
                    $rootScope.openToast("An error occurred, please try again.", 0, "manualClose");
                });
        }
        $scope.saveLookup = function() {
            let inputList1 = $scope.inputList;
            let outputList1 = $scope.outputList;
            let flag1 = 0;
            for (let i = 0; i < inputList1.length; i++) {
                if (inputList1[i].elId == undefined || inputList1[i].elId == "") {
                    flag1 = 1;
                    break;
                }
            }
            if (flag1 == 1) {
                $rootScope.openToast("Please select a value for Lookup Mapping ", 0, "manualClose");
                return;
            }
            for (let i = 0; i < outputList1.length; i++) {
                if (outputList1[i].elId == undefined || outputList1[i].elId == "") {
                    flag1 = 1;
                    break;
                }
            }
            if (flag1 == 1) {
                $rootScope.openToast("Please select a value for Lookup Mapping ", 0, "manualClose");
                return;
            }
            var dsLookup = new Object();
            dsLookup["lkpId"] = $scope.selectedLookup;
            dsLookup["dbOp"] = "I";
            if (viewEdit != 2) {
                dsLookup["lkpId"] = detailDS.lAr[indexToedit].lId;
            }
            if (viewEdit == 2) {
                dsLookup["cId"] = parentScope.datasetDetail.dCId;
            }
            dsLookup["lNm"] = lookupNameArr1[lookupNameArr1.indexOf(returnList[0])].fName;
            var inputMaparr = new Array();
            var outputMaparr = new Array();
            for (let i = 0; i < inputList1.length; i++) {
                let flagStatic=[];
                flagStatic = staticFields2.filter(fld=>fld.eId ==  inputList1[i].elId);
                if(flagStatic.length!=0)
                    inputMaparr.push({ "lkpFldId": inputList1[i].id, "eId": inputList1[i].elId,"orderKey":true })
                else
                inputMaparr.push({ "lkpFldId": inputList1[i].id, "eId": inputList1[i].elId});
            }
            for (let i = 0; i < outputList1.length; i++) {
                outputMaparr.push({ "lkpFldId": outputList1[i].id, "eId": outputList1[i].elId })
            }
            dsLookup["inputMaparr"] = inputMaparr;
            dsLookup["outputMaparr"] = outputMaparr;
            console.log(inputMaparr);
            let strJsonDsLookup = dsLookup;
            var postTosaveData = {
                "updateTransId": parentScope.datasetDetail.uTransId,
                "dsVersionId": details1['versionId'],
                "json": strJsonDsLookup,
                "mode": "false"
            };
            console.log(postTosaveData);
            if (viewEdit == 2) {
                DataSourceService.datasourceLookupdataSave(postTosaveData).then(
                    function successCallback(response) {
                        $rootScope.openToast("Data Source Lookup Fields Mapped Successfully!", 5000, "autoClose");
                        parentScope.varLookup = true;
                        parentScope.onload();
                        $mdDialog.hide();
                    },
                    function errorCallback(response) {
                        $rootScope.openToast("An error occurred, please try again.", 0, "manualClose");
                    });
            } else if (viewEdit == 1) {
                DataSourceService.datasourceLookupdataEdit(postTosaveData).then(
                    function successCallback(response) {
                        $rootScope.openToast("Data Source Lookup Fields Mapped Successfully!", 5000, "autoClose");
                        parentScope.varLookup = true;
                        parentScope.onload();
                        $mdDialog.hide();
                    },
                    function errorCallback(response) {
                        $rootScope.openToast("An error occurred, please try again.", 0, "manualClose");
                    });
            }
        }


    }

    $scope.deletelkpPopup = function(ev, indexToedit) {

        const confirm = $mdDialog.confirm().title('')
            .textContent("Are you sure you want to delete?")
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');


        $mdDialog.show(confirm).then(function() {
            let details1 = localStoreService.get('editdatasetdetails');
            var dsLookup1 = new Object();
            dsLookup1["lookupId"] = $scope.datasetDetail.lAr[indexToedit].lId;
            dsLookup1["dsVersionId"] = details1['versionId'];
            dsLookup1["updateTransId"] = $scope.datasetDetail.uTransId;
            DataSourceService.datasourceLookupDelete(dsLookup1).then(
                function successCallback(response) {
                    $scope.varLookup = true;
                    $scope.onload();
                    $window.scrollTo(0, 0);
                    $rootScope.openToast("Data Source Lookup Fields Deleted Successfully!", 5000, "autoClose");
                },
                function errorCallback(response) {
                    $window.scrollTo(0, 0);
                    $rootScope.openToast("An error occurred, please try again.", 0, "manualClose");
                });
        });

    }
    var showProjectValidationDispModePopup = function(alertmsg) {

        $mdDialog.show({
                controller: ProjValidDispModePopupController,
                templateUrl: 'html/dw/evdp/ProjectValidationDispModePopup.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: { parentScope: $scope, alertmsg: alertmsg }
            })
            .then(function() {

            }, function(error) {
                console.log(error);
            });
    };

    function ProjValidDispModePopupController($scope, $mdDialog, $rootScope, parentScope, alertmsg) {
        $scope.cancel = $mdDialog.cancel;
        $scope.hide = $mdDialog.hide;
        $scope.alertMessage = alertmsg;


    }

    // code added by Gaurav for going to Test Project Page
    $scope.gotoTestProject = function() {
        console.log($scope.datasetId);
        console.log($scope.datasetDetail);
        localStoreService.store("datasetDetail", $scope.datasetDetail);
        $location.path("/testProject")
    }

    if (localStoreService.get("listBoxFlag") == true) {
        console.log(JSON.stringify(localStoreService.get("addListPopupData")));
        $scope.showFiledProperties(localStoreService.get("addListPopupData"));
        localStoreService.store("listBoxFlag", false);
    }
});

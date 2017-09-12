mainPD:any = {};
  pd: any =[];
  panelData = {};

  panelArray: any = [];
  panelKeys: any;
  filteredPanelArray: any = [];
  matchedPanel: any = {};


this.dynamicData['dynamicFields'].PANEL_CONFIG.forEach(element => {
      this.panelKeys = Object.keys(element);
      console.log(this.panelKeys);
    });


    this.dynamicData["dynamicFields"].PANEL_DETAILS.forEach(fields => {

      if (this.panelKeys.includes(fields.SCR_LOC)) {   //this.panelKeys.indexOf(fields.SCR_LOC) > -1
        let panel = fields.SCR_LOC;
        let panels = this.dynamicData['dynamicFields'].PANEL_CONFIG[0][panel];
        panels["PANEL_CONTENT"] = fields;
        this.pd.push(panels);
        // this.matchedPanel[panelElement] = fields;
        this.panelArray.push(fields);
        // console.log(this.matchedPanel);
      }
    });
    console.log(this.pd);

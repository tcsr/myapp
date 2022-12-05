Welcome to MyApp

<div class="layout-content">
  <div class="grid dashboard">
    <div class="col-12 md:col-6 lg:col-3">
      <div class="overview-box box-sales">
        <div class="overview-box-icon"><i class="pi pi-dollar"></i></div>
        <div class="overview-box-title">Sales</div>
        <div class="overview-box-value">$ 92,440</div>
        <div class="overview-box-status"><b>20%</b> more than yesterday</div>
      </div>
    </div>
    <div class="col-12 md:col-6 lg:col-3">
      <div class="overview-box box-views">
        <div class="overview-box-icon"><i class="pi pi-search"></i></div>
        <div class="overview-box-title">Views</div>
        <div class="overview-box-value">7029</div>
        <div class="overview-box-status"><b>7%</b> more than yesterday</div>
      </div>
    </div>
    <div class="col-12 md:col-6 lg:col-3">
      <div class="overview-box box-users">
        <div class="overview-box-icon"><i class="pi pi-user"></i></div>
        <div class="overview-box-title">Users</div>
        <div class="overview-box-value">9522</div>
        <div class="overview-box-status"><b>12%</b> more than yesterday</div>
      </div>
    </div>
    <div class="col-12 md:col-6 lg:col-3">
      <div class="overview-box box-checkins">
        <div class="overview-box-icon"><i class="pi pi-map-marker"></i></div>
        <div class="overview-box-title">Check-ins</div>
        <div class="overview-box-value">4211</div>
        <div class="overview-box-status"><b>3%</b> more than yesterday</div>
      </div>
    </div>
  </div>
</div>

=========================================================================================


.layout-content {
    flex: 1 1 0;
    padding: 2em;
    background: #f2f2f2;
}

.dashboard .overview-box {
    text-align: center;
    position: relative;
    margin-right: 5px;
    margin-bottom: 5px;
    margin-top: 1em;
    color: #ffffff;
    border: solid 1px #dfe6ee;
    border-radius: 3px;
}

.dashboard .overview-box .overview-box-icon {
    width: 45px;
    line-height: 40px;
    height: 45px;
    font-size: 24px;
    margin: auto;
    margin-top: -24px;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
}

.dashboard .overview-box.box-sales {
    background-image: linear-gradient(to right, #f8c737, #f4a22e);
}

.dashboard .overview-box.box-sales .overview-box-icon {
    background-color: #f4a52f;
    border: solid 1.4px #ffd1a5;
}

.dashboard .overview-box .overview-box-title {
    padding: 8px;
    font-size: 18px;
    letter-spacing: 0.23px;
}

.dashboard .overview-box .overview-box-value {
    padding: 8px;
    font-size: 30px;
    letter-spacing: 1px;
}

.dashboard .overview-box .overview-box-status {
    padding: 8px;
    font-size: 14px;
}

.dashboard .overview-box.box-views {
    background-image: linear-gradient(to right, #12aeee, #0080d4);
}

.dashboard .overview-box.box-views .overview-box-icon {
    background-color: #0183d6;
    border: solid 1.4px #96dbf7;
}

.dashboard .overview-box.box-users .overview-box-icon {
    background-color: #fe5288;
    border: solid 1.4px #f4cfdb;
}

.dashboard .overview-box.box-users {
    background-image: linear-gradient(to right, #fe7b94, #fd4a85);
}

.dashboard .overview-box.box-checkins .overview-box-icon {
    padding: 5px 7px;
    line-height: 30px;
    background-color: #9346dd;
    border: solid 1.4px #dac2ef;
}

.dashboard .overview-box.box-checkins {
    margin-right: 0;
    background-image: linear-gradient(to right, #bc74f8, #9042db);
}

.dashboard .overview-box.box-checkins .overview-box-icon {
    padding: 5px 7px;
    line-height: 30px;
    background-color: #9346dd;
    border: solid 1.4px #dac2ef;
}

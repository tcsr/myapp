this.results$ = interval(60000)
          .pipe(
            startWith(0),
            switchMap(() => from(this.service.getDetails())))
          .pipe(tap(result => {
            this.zone.run(() => {
              this.loaded = true;
              this.status = this.updateMessage(result);
            });
          }))
          .pipe(share());
          
          
           this.resulSub$ = this.results$.subscribe(val => console.log('sub', val));
           
           //onDestroy
           
    if (this.resulSub$ != null) {
      this.resulSub$.unsubscribe();
    }

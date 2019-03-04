var mixer = mixitup('#rec-container', {
  multifilter: {
    enable: true // enable the multifilter extension for the mixer
  }
});

var checkboxMultiFilter = {

    // Declare any variables needed as properties of the object
    $filters: null,
    $filterGroups: null,
    groups: [],
    outputArray: [],
    outputString: '',

    // The "init" method will run on document ready and cache any jQuery objects we will need.

    init: function(){
      var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "checkboxFilter" object so that we can share methods and properties between all parts of the object.

      self.$filters = $('#filters');
      self.$filterGroups = $('checkbox-group');
      self.$container = $('#rec-container');

      self.$filterGroups.each(function(){
        self.groups.push({
          $inputs: $(this).find('input'),
          active: [],
          tracker: false
        });
      });

      self.bindHandlers();
    },

    // The "bindHandlers" method will listen for whenever a button is clicked.

    bindHandlers: function(){
      var self = this;

      self.$filterGroups.filter('.checkboxes').on('change', function() {
      	self.parseFilters();
    	});

    // self.$container.on('click', 'input', function(e){
    //   self.parseFilters();
    // });
    // self.$container.on('change', function(){
    //   self.parseFilters();
    // });
  },

    // The parseFilters method checks which filters are active in each group:

    parseFilters: function(){
      var self = this;

      // loop through each filter group and grap the active filter from each one.
      for(var i = 0, group; group = self.groups[i]; i++){
        group.active = []; // reset arrays
        group.$inputs.each(function(){
          var $input = $(this);
          if ($input.is(':checked')) {
            group.active.push(this.value);
          }
        });
      }
      self.concatenate();
    },

    // The "concatenate" method will crawl through each group, concatenating filters as desired:

    concatenate: function(){
        var self = this,
          cache = '',
          crawled = false,
          checkTrackers = function(){
            var done = 0;

            for(var i = 0, group; group = self.groups[i]; i++){
              (group.tracker === false) && done++;
            }

            return (done < self.groups.length);
          },
          crawl = function(){
            for(var i = 0, group; group = self.groups[i]; i++){
              group.active[group.tracker] && (cache += group.active[group.tracker]);

              if(i === self.groups.length - 1){
                self.outputArray.push(cache);
                cache = '';
                updateTrackers();
              }
            }
          },
          updateTrackers = function(){
            for(var i = self.groups.length - 1; i > -1; i--){
              var group = self.groups[i];

              if(group.active[group.tracker + 1]){
                group.tracker++;
                break;
              } else if(i > 0){
                group.tracker && (group.tracker = 0);
              } else {
                crawled = true;
              }
            }
          };

        self.outputArray = []; // reset output array

        do{
          crawl();
        }
        while(!crawled && checkTrackers());

        self.outputString = self.outputArray.join();

        // If the output string is empty, show all rather than none:

        !self.outputString.length && (self.outputString = 'all');

        console.log(self.outputString);

        // ^ we can check the console here to take a look at the filter string that is produced

      // Send the output string to MixItUp via the 'filter' method:

      if(self.$container.mixItUp('isLoaded')){
        self.$container.mixItUp('filter', self.outputString);
      }
    }
  };

  // Initialize checkboxFilter code
  checkboxMultiFilter.init();


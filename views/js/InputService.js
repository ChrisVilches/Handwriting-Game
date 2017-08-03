class InputService {

  constructor(options){

    this.getOptions(options);
    this.googleUrl = 'https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=translate';

  }

  getOptions(options){

    if(typeof options !== 'object' || options == null) return;

    this.width = 400;
    this.height = 400;
    this.lang = "ja";

    if(typeof options.width === 'number')
      this.width = options.width;

    if(typeof options.height === 'number')
      this.height = options.height;

    if(typeof options.lang === 'string')
      this.lang = options.lang;
  }

  getCharacters(dots, success, error){

    var data = {
      app_version: 0.4,
      requests:[
        {
          writing_guide: {
            writing_area_width: this.width,
            writing_area_height: this.height
          },
          pre_context:"",
          max_num_results: 10,
          max_completions: 0,
          language: this.lang,
          ink: dots
        }
      ]
    };

    $.ajax({
      url: this.googleUrl,
      method: 'POST',
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function(res){
        success(res[1][0][1]);
      },
      error: error
    });
  }
}

module.exports = InputService;

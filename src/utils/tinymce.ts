export const tinymceConfig = {
  init: {
    width: '100%',
    height: 300,
    menubar: false,
    branding: false,
    language: 'zh_CN',
    plugins: [
      'autolink',
      'charmap',
      'searchreplace',
      'wordcount',
      'visualchars',
      'nonbreaking',
      'code indent2em',
    ],
    toolbar:
        'undo redo | styles styleselect fontsize | bold italic | alignleft aligncenter alignright alignjustify lineheight | ' +
        'outdent indent | forecolor backcolor | code indent2em',
    font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
    line_height_formats: '1 1.2 1.4 1.6 2',
    nonbreaking_force_tab: true,
  },
};

export const apiKey: string = "hwoqxz1y2kosc1ai6xmjs8h3zm6f7agsps1ss9cw2hmb1rcg";

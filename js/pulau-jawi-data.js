window.PULAU_JAWI_DATA = {
  brand: {
    name: 'Pulau Jawi',
    tagline: 'Belajar Jawi Melalui Pengembaraan',
    price: 'RM49 Lifetime',
    childSlots: '3 anak + add-on slot'
  },
  avatars: {
    zafri: 'assets/avatars/zafri/zafri-happy.svg',
    zainab: 'assets/avatars/zainab/zainab-happy.svg'
  },
  islands: [
    {id:1, title:'Pulau Huruf Ajaib', age:'5-6', icon:'🎈', theme:'biru kapas', game:'Pop Huruf', skill:'Kenal huruf Alif hingga Ya', instruction:'Dengar arahan dan tekan huruf Jawi yang betul.', color:'blue', questions:[
      {prompt:'Cari huruf Alif', voice:'Cari huruf Alif', answer:'ا', options:['ا','ب','ت','ث']},
      {prompt:'Cari huruf Ba', voice:'Cari huruf Ba', answer:'ب', options:['ن','ب','ج','ح']},
      {prompt:'Cari huruf Ta', voice:'Cari huruf Ta', answer:'ت', options:['ت','س','ش','ص']},
      {prompt:'Cari huruf Mim', voice:'Cari huruf Mim', answer:'م', options:['ل','م','ن','و']},
      {prompt:'Cari huruf Ya', voice:'Cari huruf Ya', answer:'ي', options:['ى','ي','ا','ه']}
    ]},
    {id:2, title:'Gua Bunyi Jawi', age:'5-6', icon:'🎵', theme:'hijau bunyi', game:'Dengar & Pilih', skill:'Dengar bunyi huruf', instruction:'Tekan speaker, dengar bunyi, kemudian pilih jawapan.', color:'green', questions:[
      {prompt:'Bunyi: Jim', voice:'Jim', answer:'ج', options:['ح','خ','ج','چ']},
      {prompt:'Bunyi: Dal', voice:'Dal', answer:'د', options:['د','ذ','ر','ز']},
      {prompt:'Bunyi: Sin', voice:'Sin', answer:'س', options:['ش','س','ص','ض']},
      {prompt:'Bunyi: Lam', voice:'Lam', answer:'ل', options:['م','ن','ل','ك']},
      {prompt:'Bunyi: Wau', voice:'Wau', answer:'و', options:['ه','و','ي','ا']}
    ]},
    {id:3, title:'Hutan Padanan', age:'6-7', icon:'🧩', theme:'ungu kad', game:'Padan Rumi-Jawi', skill:'Padankan huruf Rumi ke Jawi', instruction:'Pilih huruf Jawi yang sama dengan huruf Rumi.', color:'purple', questions:[
      {prompt:'Rumi A sepadan dengan?', voice:'Rumi A sepadan dengan Alif', answer:'ا', options:['ا','ع','غ','ف']},
      {prompt:'Rumi B sepadan dengan?', voice:'Rumi B sepadan dengan Ba', answer:'ب', options:['پ','ب','ت','ث']},
      {prompt:'Rumi M sepadan dengan?', voice:'Rumi M sepadan dengan Mim', answer:'م', options:['م','ن','ل','و']},
      {prompt:'Rumi S sepadan dengan?', voice:'Rumi S sepadan dengan Sin', answer:'س', options:['س','ش','ص','ث']},
      {prompt:'Rumi K sepadan dengan?', voice:'Rumi K sepadan dengan Kaf', answer:'ك', options:['ڬ','ق','ك','ف']}
    ]},
    {id:4, title:'Sungai Huruf Laju', age:'6-7', icon:'🚣', theme:'sungai biru', game:'Tangkap Huruf', skill:'Kenal huruf bergerak', instruction:'Tangkap huruf yang disebut sebelum masa tamat.', color:'cyan', questions:[
      {prompt:'Tangkap huruf Nun', voice:'Tangkap huruf Nun', answer:'ن', options:['ن','ب','ي','ت']},
      {prompt:'Tangkap huruf Ha', voice:'Tangkap huruf Ha', answer:'ه', options:['ح','خ','ه','ة']},
      {prompt:'Tangkap huruf Ra', voice:'Tangkap huruf Ra', answer:'ر', options:['ز','ر','د','ذ']},
      {prompt:'Tangkap huruf Fa', voice:'Tangkap huruf Fa', answer:'ف', options:['ق','ف','ڤ','غ']},
      {prompt:'Tangkap huruf Qaf', voice:'Tangkap huruf Qaf', answer:'ق', options:['ك','ق','ڬ','ف']}
    ]},
    {id:5, title:'Istana Suku Kata', age:'6-7', icon:'🏰', theme:'kuning istana', game:'Bina Suku Kata', skill:'Gabung bunyi mudah', instruction:'Pilih jawapan Jawi untuk suku kata yang diberi.', color:'yellow', questions:[
      {prompt:'Suku kata BA', voice:'Pilih suku kata Ba', answer:'با', options:['تا','با','ما','سا']},
      {prompt:'Suku kata MA', voice:'Pilih suku kata Ma', answer:'ما', options:['نا','ما','لا','وا']},
      {prompt:'Suku kata KU', voice:'Pilih suku kata Ku', answer:'كو', options:['كو','بو','دو','فو']},
      {prompt:'Suku kata MI', voice:'Pilih suku kata Mi', answer:'مي', options:['ني','مي','لي','هي']},
      {prompt:'Suku kata SA', voice:'Pilih suku kata Sa', answer:'سا', options:['شا','سا','ثا','صا']}
    ]},
    {id:6, title:'Kampung Perkataan', age:'7-8', icon:'🏡', theme:'kampung ceria', game:'Cari Perkataan', skill:'Baca perkataan mudah', instruction:'Cari ejaan Jawi yang betul untuk perkataan Rumi.', color:'orange', questions:[
      {prompt:'Ejaan Jawi BATU', voice:'Cari ejaan Jawi Batu', answer:'باتو', options:['باتو','بوتا','تابو','بابو']},
      {prompt:'Ejaan Jawi BOLA', voice:'Cari ejaan Jawi Bola', answer:'بولا', options:['بولا','بالا','لوبا','بولي']},
      {prompt:'Ejaan Jawi MATA', voice:'Cari ejaan Jawi Mata', answer:'ماتا', options:['ماتا','ماتي','تامم','ماما']},
      {prompt:'Ejaan Jawi KAKI', voice:'Cari ejaan Jawi Kaki', answer:'كاكي', options:['كاكي','كيكا','كوكو','كاكو']},
      {prompt:'Ejaan Jawi IBU', voice:'Cari ejaan Jawi Ibu', answer:'ايبو', options:['ايبو','ابو','بيو','اوب']}
    ]},
    {id:7, title:'Taman Memori Jawi', age:'7-8', icon:'🌳', theme:'taman hijau', game:'Memory Card', skill:'Ingat pasangan perkataan', instruction:'Ingat perkataan Rumi dan pilih pasangan Jawi yang betul.', color:'mint', questions:[
      {prompt:'Pasangan Jawi untuk AIR', voice:'Cari pasangan Jawi Air', answer:'اير', options:['اير','ايس','امي','اري']},
      {prompt:'Pasangan Jawi untuk API', voice:'Cari pasangan Jawi Api', answer:'اڤي', options:['اڤي','افي','ابي','اڤا']},
      {prompt:'Pasangan Jawi untuk GIGI', voice:'Cari pasangan Jawi Gigi', answer:'ݢيݢي', options:['ݢيݢي','كيكي','جيجي','ݢاݢا']},
      {prompt:'Pasangan Jawi untuk SUSU', voice:'Cari pasangan Jawi Susu', answer:'سوسو', options:['سوسو','سيسي','شوشو','ساسو']},
      {prompt:'Pasangan Jawi untuk BUKU', voice:'Cari pasangan Jawi Buku', answer:'بوكو', options:['بوكو','بوقو','كوبو','باكو']}
    ]},
    {id:8, title:'Gunung Teka Kata', age:'7-8', icon:'⛰️', theme:'gunung cabaran', game:'Teka Perkataan', skill:'Faham maksud perkataan', instruction:'Lihat gambar/emoji petunjuk dan pilih perkataan Jawi.', color:'red', questions:[
      {prompt:'Petunjuk 🐟 IKAN', voice:'Pilih ejaan Jawi Ikan', answer:'ايكن', options:['ايكن','اكن','ايكم','ايم']},
      {prompt:'Petunjuk 🐱 KUCING', voice:'Pilih ejaan Jawi Kucing', answer:'كوچيڠ', options:['كوچيڠ','كوچين','كوچڠ','كوجيڠ']},
      {prompt:'Petunjuk 🏠 RUMAH', voice:'Pilih ejaan Jawi Rumah', answer:'رومه', options:['رومه','رماه','موراه','روما']},
      {prompt:'Petunjuk 🌙 BULAN', voice:'Pilih ejaan Jawi Bulan', answer:'بولن', options:['بولن','بولا','بيلن','لوبن']},
      {prompt:'Petunjuk ☀️ MATAHARI', voice:'Pilih ejaan Jawi Matahari', answer:'ماتهاري', options:['ماتهاري','ماتاهري','ماتهري','ماتهادي']}
    ]},
    {id:9, title:'Kota Ayat Ceria', age:'8', icon:'⚔️', theme:'kota hikmah', game:'Susun Ayat', skill:'Bina frasa pendek', instruction:'Pilih ayat Jawi yang paling sesuai.', color:'pink', questions:[
      {prompt:'Saya ada buku.', voice:'Pilih ayat Saya ada buku', answer:'ساي اد بوكو', options:['ساي اد بوكو','ساي ادا بولا','اد ساي بوكو','بوكو اد ساي']},
      {prompt:'Ali makan nasi.', voice:'Pilih ayat Ali makan nasi', answer:'علي ماكن ناسي', options:['علي ماكن ناسي','علي مينوم ناسي','الي ماكن اير','علي اد ناسي']},
      {prompt:'Ibu baca buku.', voice:'Pilih ayat Ibu baca buku', answer:'ايبو باچ بوكو', options:['ايبو باچ بوكو','ايبو ماكن بوكو','ايبو باوا بوكو','بوكو باچ ايبو']},
      {prompt:'Adik minum susu.', voice:'Pilih ayat Adik minum susu', answer:'اديق مينوم سوسو', options:['اديق مينوم سوسو','اديق ماكن سوسو','اديق اد سوسو','سوسو مينوم اديق']},
      {prompt:'Saya suka Jawi.', voice:'Pilih ayat Saya suka Jawi', answer:'ساي سوك جاوي', options:['ساي سوك جاوي','ساي سوك رومي','جاوي سوك ساي','ساي باچ جاوي']}
    ]},
    {id:10, title:'Istana Pendekar Jawi', age:'8', icon:'👑', theme:'emas boss', game:'Boss Battle', skill:'Ulang kaji semua kemahiran', instruction:'Jawab semua cabaran untuk jadi Pendekar Jawi.', color:'gold', questions:[
      {prompt:'Huruf Ba ialah?', voice:'Huruf Ba ialah?', answer:'ب', options:['ب','ت','ث','ن']},
      {prompt:'BATU dalam Jawi?', voice:'Batu dalam Jawi?', answer:'باتو', options:['باتو','بوتا','تابو','باتي']},
      {prompt:'Pasangan AIR?', voice:'Pasangan Air', answer:'اير', options:['اير','اڤي','ايكن','اد']},
      {prompt:'Saya suka Jawi.', voice:'Saya suka Jawi', answer:'ساي سوك جاوي', options:['ساي سوك جاوي','ساي سوك رومي','جاوي سوك ساي','ساي اد جاوي']},
      {prompt:'Pilih huruf Ya', voice:'Pilih huruf Ya', answer:'ي', options:['ي','و','ه','ا']}
    ]}
  ]
};

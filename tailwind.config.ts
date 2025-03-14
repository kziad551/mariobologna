import type {Config} from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        '2xl': '1440px',
        xs: '380px',
        ss: '450px',
      },
      spacing: {
        '0.25': '1px',
        '0.75': '3px',
        '1.25': '5px',
        '1.75': '7px',
        '2.25': '9px',
        '2.75': '11px',
        '3.25': '13px',
        '3.75': '15px',
        '4.25': '17px',
        '4.5': '18px',
        '4.75': '19px',
        '5.25': '21px',
        '5.5': '22px',
        '5.75': '23px',
        '6.25': '25px',
        '6.5': '26px',
        '6.75': '27px',
        '7.25': '29px',
        '7.5': '30px',
        '7.75': '31px',
        '8.25': '33px',
        '8.5': '34px',
        '8.75': '35px',
        '9.25': '37px',
        '9.5': '38px',
        '9.75': '39px',
        '10.25': '41px',
        '10.5': '42px',
        '10.75': '43px',
        '11.25': '45px',
        '11.5': '46px',
        '11.75': '47px',
        '12.25': '49px',
        '12.5': '50px',
        '12.75': '51px',
        '13': '52px',
        '13.25': '53px',
        '13.5': '54px',
        '13.75': '55px',
        '14.25': '57px',
        '14.5': '58px',
        '14.75': '59px',
        '15': '60px',
        '15.25': '61px',
        '15.5': '62px',
        '15.75': '63px',
        '16.25': '65px',
        '16.5': '66px',
        '16.75': '67px',
        '17': '68px',
        '17.25': '69px',
        '17.5': '70px',
        '17.75': '71px',
        '18': '72px',
        '18.25': '73px',
        '18.5': '74px',
        '18.75': '75px',
        '19': '76px',
        '19.25': '77px',
        '19.5': '78px',
        '19.75': '79px',
        '20.25': '81px',
        '20.5': '82px',
        '20.75': '83px',
        '21': '84px',
        '21.25': '85px',
        '21.5': '86px',
        '21.75': '87px',
        '22': '88px',
        '22.25': '89px',
        '22.5': '90px',
        '22.75': '91px',
        '23': '92px',
        '23.25': '93px',
        '23.5': '94px',
        '23.75': '95px',
        '24.25': '97px',
        '24.5': '98px',
        '24.75': '99px',
        '25': '100px',
        '25.25': '101px',
        '25.5': '102px',
        '25.75': '103px',
        '26': '104px',
        '26.25': '105px',
        '26.5': '106px',
        '26.75': '107px',
        '27': '108px',
        '27.25': '109px',
        '27.5': '110px',
        '27.75': '111px',
        '28.25': '113px',
        '28.5': '114px',
        '28.75': '115px',
        '29': '116px',
        '29.25': '117px',
        '29.5': '118px',
        '29.75': '119px',
        '30': '120px',
        '30.25': '121px',
        '30.5': '122px',
        '30.75': '123px',
        '31': '124px',
        '31.25': '125px',
        '31.5': '126px',
        '31.75': '127px',
        '32.25': '129px',
        '32.5': '130px',
        '32.75': '131px',
        '33': '132px',
        '33.25': '133px',
        '33.5': '134px',
        '33.75': '135px',
        '34': '136px',
        '34.25': '137px',
        '34.5': '138px',
        '34.75': '139px',
        '35': '140px',
        '35.25': '141px',
        '35.5': '142px',
        '35.75': '143px',
        '36.25': '145px',
        '36.5': '146px',
        '36.75': '147px',
        '37': '148px',
        '37.25': '149px',
        '37.5': '150px',
        '37.75': '151px',
        '38': '152px',
        '38.25': '153px',
        '38.5': '154px',
        '38.75': '155px',
        '39': '156px',
        '39.25': '157px',
        '39.5': '158px',
        '39.75': '159px',
        '40.25': '161px',
        '40.5': '162px',
        '40.75': '163px',
        '41': '164px',
        '41.25': '165px',
        '41.5': '166px',
        '41.75': '167px',
        '42': '168px',
        '42.25': '169px',
        '42.5': '170px',
        '42.75': '171px',
        '43': '172px',
        '43.25': '173px',
        '43.5': '174px',
        '43.75': '175px',
        '44.25': '177px',
        '44.5': '178px',
        '44.75': '179px',
        '45': '180px',
        '45.25': '181px',
        '45.5': '182px',
        '45.75': '183px',
        '46': '184px',
        '46.25': '185px',
        '46.5': '186px',
        '46.75': '187px',
        '47': '188px',
        '47.25': '189px',
        '47.5': '190px',
        '47.75': '191px',
        '48.25': '193px',
        '48.5': '194px',
        '48.75': '195px',
        '49': '196px',
        '49.25': '197px',
        '49.5': '198px',
        '49.75': '199px',
        '50': '200px',
        '50.25': '201px',
        '50.5': '202px',
        '50.75': '203px',
        '51': '204px',
        '51.25': '205px',
        '51.5': '206px',
        '51.75': '207px',
        '52.25': '209px',
        '52.5': '210px',
        '52.75': '211px',
        '53': '212px',
        '53.25': '213px',
        '53.5': '214px',
        '53.75': '215px',
        '54': '216px',
        '54.25': '217px',
        '54.5': '218px',
        '54.75': '219px',
        '55': '220px',
        '55.25': '221px',
        '55.5': '222px',
        '55.75': '223px',
        '56.25': '225px',
        '56.5': '226px',
        '56.75': '227px',
        '57': '228px',
        '57.25': '229px',
        '57.5': '230px',
        '57.75': '231px',
        '58': '232px',
        '58.25': '233px',
        '58.5': '234px',
        '58.75': '235px',
        '59': '236px',
        '59.25': '237px',
        '59.5': '238px',
        '59.75': '239px',
        '60.25': '241px',
        '60.5': '242px',
        '60.75': '243px',
        '61': '244px',
        '61.25': '245px',
        '61.5': '246px',
        '61.75': '247px',
        '62': '248px',
        '62.25': '249px',
        '62.5': '250px',
        '62.75': '251px',
        '63': '252px',
        '63.25': '253px',
        '63.5': '254px',
        '63.75': '255px',
        '64.25': '257px',
        '64.5': '258px',
        '64.75': '259px',
        '65': '260px',
        '65.25': '261px',
        '65.5': '262px',
        '65.75': '263px',
        '66': '264px',
        '66.25': '265px',
        '66.5': '266px',
        '66.75': '267px',
        '67': '268px',
        '67.25': '269px',
        '67.5': '270px',
        '67.75': '271px',
        '68': '272px',
        '68.25': '273px',
        '68.5': '274px',
        '68.75': '275px',
        '69': '276px',
        '69.25': '277px',
        '69.5': '278px',
        '69.75': '279px',
        '70': '280px',
        '70.25': '281px',
        '70.5': '282px',
        '70.75': '283px',
        '71': '284px',
        '71.25': '285px',
        '71.5': '286px',
        '71.75': '287px',
        '72.25': '289px',
        '72.5': '290px',
        '72.75': '291px',
        '73': '292px',
        '73.25': '293px',
        '73.5': '294px',
        '73.75': '295px',
        '74': '296px',
        '74.25': '297px',
        '74.5': '298px',
        '74.75': '299px',
        '75': '300px',
        '75.25': '301px',
        '75.5': '302px',
        '75.75': '303px',
        '76': '304px',
        '76.25': '305px',
        '76.5': '306px',
        '76.75': '307px',
        '77': '308px',
        '77.25': '309px',
        '77.5': '310px',
        '77.75': '311px',
        '78': '312px',
        '78.25': '313px',
        '78.5': '314px',
        '78.75': '315px',
        '79': '316px',
        '79.25': '317px',
        '79.5': '318px',
        '79.75': '319px',
        '80.25': '321px',
        '80.5': '322px',
        '80.75': '323px',
        '81': '324px',
        '81.25': '325px',
        '81.5': '326px',
        '81.75': '327px',
        '82': '328px',
        '82.25': '329px',
        '82.5': '330px',
        '82.75': '331px',
        '83': '332px',
        '83.25': '333px',
        '83.5': '334px',
        '83.75': '335px',
        '84': '336px',
        '84.25': '337px',
        '84.5': '338px',
        '84.75': '339px',
        '85': '340px',
        '85.25': '341px',
        '85.5': '342px',
        '85.75': '343px',
        '86': '344px',
        '86.25': '345px',
        '86.5': '346px',
        '86.75': '347px',
        '87': '348px',
        '87.25': '349px',
        '87.5': '350px',
        '87.75': '351px',
        '88': '352px',
        '88.25': '353px',
        '88.5': '354px',
        '88.75': '355px',
        '89': '356px',
        '89.25': '357px',
        '89.5': '358px',
        '89.75': '359px',
        '90': '360px',
        '90.25': '361px',
        '90.5': '362px',
        '90.75': '363px',
        '91': '364px',
        '91.25': '365px',
        '91.5': '366px',
        '91.75': '367px',
        '92': '368px',
        '92.25': '369px',
        '92.5': '370px',
        '92.75': '371px',
        '93': '372px',
        '93.25': '373px',
        '93.5': '374px',
        '93.75': '375px',
        '94': '376px',
        '94.25': '377px',
        '94.5': '378px',
        '94.75': '379px',
        '95': '380px',
        '95.25': '381px',
        '95.5': '382px',
        '95.75': '383px',
        '96.25': '385px',
        '96.5': '386px',
        '96.75': '387px',
        '97': '388px',
        '97.25': '389px',
        '97.5': '390px',
        '97.75': '391px',
        '98': '392px',
        '98.25': '393px',
        '98.5': '394px',
        '98.75': '395px',
        '99': '396px',
        '99.25': '397px',
        '99.5': '398px',
        '99.75': '399px',
        '100': '400px',
        '100.25': '401px',
        '100.5': '402px',
        '100.75': '403px',
        '101': '404px',
        '101.25': '405px',
        '101.5': '406px',
        '101.75': '407px',
        '102': '408px',
        '102.25': '409px',
        '102.5': '410px',
        '102.75': '411px',
        '103': '412px',
        '103.25': '413px',
        '103.5': '414px',
        '103.75': '415px',
        '104': '416px',
        '104.25': '417px',
        '104.5': '418px',
        '104.75': '419px',
        '105': '420px',
        '105.25': '421px',
        '105.5': '422px',
        '105.75': '423px',
        '106': '424px',
        '106.25': '425px',
        '106.5': '426px',
        '106.75': '427px',
        '107': '428px',
        '107.25': '429px',
        '107.5': '430px',
        '107.75': '431px',
        '108': '432px',
        '108.25': '433px',
        '108.5': '434px',
        '108.75': '435px',
        '109': '436px',
        '109.25': '437px',
        '109.5': '438px',
        '109.75': '439px',
        '110': '440px',
        '110.25': '441px',
        '110.5': '442px',
        '110.75': '443px',
        '111': '444px',
        '111.25': '445px',
        '111.5': '446px',
        '111.75': '447px',
        '112': '448px',
        '112.25': '449px',
        '112.5': '450px',
        '112.75': '451px',
        '113': '452px',
        '113.25': '453px',
        '113.5': '454px',
        '113.75': '455px',
        '114': '456px',
        '114.25': '457px',
        '114.5': '458px',
        '114.75': '459px',
        '115': '460px',
        '115.25': '461px',
        '115.5': '462px',
        '115.75': '463px',
        '116': '464px',
        '116.25': '465px',
        '116.5': '466px',
        '116.75': '467px',
        '117': '468px',
        '117.25': '469px',
        '117.5': '470px',
        '117.75': '471px',
        '118': '472px',
        '118.25': '473px',
        '118.5': '474px',
        '118.75': '475px',
        '119': '476px',
        '119.25': '477px',
        '119.5': '478px',
        '119.75': '479px',
        '120': '480px',
        '120.25': '481px',
        '120.5': '482px',
        '120.75': '483px',
        '121': '484px',
        '121.25': '485px',
        '121.5': '486px',
        '121.75': '487px',
        '122': '488px',
        '122.25': '489px',
        '122.5': '490px',
        '122.75': '491px',
        '123': '492px',
        '123.25': '493px',
        '123.5': '494px',
        '123.75': '495px',
        '124': '496px',
        '124.25': '497px',
        '124.5': '498px',
        '124.75': '499px',
        '125': '500px',
        '125.25': '501px',
        '125.5': '502px',
        '125.75': '503px',
        '126': '504px',
        '126.25': '505px',
        '126.5': '506px',
        '126.75': '507px',
        '127': '508px',
        '127.25': '509px',
        '127.5': '510px',
        '127.75': '511px',
        '128': '512px',
        '128.25': '513px',
        '128.5': '514px',
        '128.75': '515px',
        '129': '516px',
        '129.25': '517px',
        '129.5': '518px',
        '129.75': '519px',
        '130': '520px',
        '130.25': '521px',
        '130.5': '522px',
        '130.75': '523px',
        '131': '524px',
        '131.25': '525px',
        '131.5': '526px',
        '131.75': '527px',
        '132': '528px',
        '132.25': '529px',
        '132.5': '530px',
        '132.75': '531px',
        '133': '532px',
        '133.25': '533px',
        '133.5': '534px',
        '133.75': '535px',
        '134': '536px',
        '134.25': '537px',
        '134.5': '538px',
        '134.75': '539px',
        '135': '540px',
        '135.25': '541px',
        '135.5': '542px',
        '135.75': '543px',
        '136': '544px',
        '136.25': '545px',
        '136.5': '546px',
        '136.75': '547px',
        '137': '548px',
        '137.25': '549px',
        '137.5': '550px',
        '137.75': '551px',
        '138': '552px',
        '138.25': '553px',
        '138.5': '554px',
        '138.75': '555px',
        '139': '556px',
        '139.25': '557px',
        '139.5': '558px',
        '139.75': '559px',
        '140': '560px',
        '140.25': '561px',
        '140.5': '562px',
        '140.75': '563px',
        '141': '564px',
        '141.25': '565px',
        '141.5': '566px',
        '141.75': '567px',
        '142': '568px',
        '142.25': '569px',
        '142.5': '570px',
        '142.75': '571px',
        '143': '572px',
        '143.25': '573px',
        '143.5': '574px',
        '143.75': '575px',
        '144': '576px',
        '144.25': '577px',
        '144.5': '578px',
        '144.75': '579px',
        '145': '580px',
        '145.25': '581px',
        '145.5': '582px',
        '145.75': '583px',
        '146': '584px',
        '146.25': '585px',
        '146.5': '586px',
        '146.75': '587px',
        '147': '588px',
        '147.25': '589px',
        '147.5': '590px',
        '147.75': '591px',
        '148': '592px',
        '148.25': '593px',
        '148.5': '594px',
        '148.75': '595px',
        '149': '596px',
        '149.25': '597px',
        '149.5': '598px',
        '149.75': '599px',
        '150': '600px',
        '150.25': '601px',
        '150.5': '602px',
        '150.75': '603px',
        '151': '604px',
        '151.25': '605px',
        '151.5': '606px',
        '151.75': '607px',
        '152': '608px',
        '152.25': '609px',
        '152.5': '610px',
        '152.75': '611px',
        '153': '612px',
        '153.25': '613px',
        '153.5': '614px',
        '153.75': '615px',
        '154': '616px',
        '154.25': '617px',
        '154.5': '618px',
        '154.75': '619px',
        '155': '620px',
        '155.25': '621px',
        '155.5': '622px',
        '155.75': '623px',
        '156': '624px',
        '156.25': '625px',
        '156.5': '626px',
        '156.75': '627px',
        '157': '628px',
        '157.25': '629px',
        '157.5': '630px',
        '157.75': '631px',
        '158': '632px',
        '158.25': '633px',
        '158.5': '634px',
        '158.75': '635px',
        '159': '636px',
        '159.25': '637px',
        '159.5': '638px',
        '159.75': '639px',
        '160': '640px',
        '160.25': '641px',
        '160.5': '642px',
        '160.75': '643px',
        '161': '644px',
        '161.25': '645px',
        '161.5': '646px',
        '161.75': '647px',
        '162': '648px',
        '162.25': '649px',
        '162.5': '650px',
        '162.75': '651px',
        '163': '652px',
        '163.25': '653px',
        '163.5': '654px',
        '163.75': '655px',
        '164': '656px',
        '164.25': '657px',
        '164.5': '658px',
        '164.75': '659px',
        '165': '660px',
        '165.25': '661px',
        '165.5': '662px',
        '165.75': '663px',
        '166': '664px',
        '166.25': '665px',
        '166.5': '666px',
        '166.75': '667px',
        '167': '668px',
        '167.25': '669px',
        '167.5': '670px',
        '167.75': '671px',
        '168': '672px',
        '168.25': '673px',
        '168.5': '674px',
        '168.75': '675px',
        '169': '676px',
        '169.25': '677px',
        '169.5': '678px',
        '169.75': '679px',
        '170': '680px',
        '170.25': '681px',
        '170.5': '682px',
        '170.75': '683px',
        '171': '684px',
        '171.25': '685px',
        '171.5': '686px',
        '171.75': '687px',
        '172': '688px',
        '172.25': '689px',
        '172.5': '690px',
        '172.75': '691px',
        '173': '692px',
        '173.25': '693px',
        '173.5': '694px',
        '173.75': '695px',
        '174': '696px',
        '174.25': '697px',
        '174.5': '698px',
        '174.75': '699px',
        '175': '700px',
        '175.25': '701px',
        '175.5': '702px',
        '175.75': '703px',
        '176': '704px',
        '176.25': '705px',
        '176.5': '706px',
        '176.75': '707px',
        '177': '708px',
        '177.25': '709px',
        '177.5': '710px',
        '177.75': '711px',
        '178': '712px',
        '178.25': '713px',
        '178.5': '714px',
        '178.75': '715px',
        '179': '716px',
        '179.25': '717px',
        '179.5': '718px',
        '179.75': '719px',
        '180': '720px',
        '180.25': '721px',
        '180.5': '722px',
        '180.75': '723px',
        '181': '724px',
        '181.25': '725px',
        '181.5': '726px',
        '181.75': '727px',
        '182': '728px',
        '182.25': '729px',
        '182.5': '730px',
        '182.75': '731px',
        '183': '732px',
        '183.25': '733px',
        '183.5': '734px',
        '183.75': '735px',
        '184': '736px',
        '184.25': '737px',
        '184.5': '738px',
        '184.75': '739px',
        '185': '740px',
        '185.25': '741px',
        '185.5': '742px',
        '185.75': '743px',
        '186': '744px',
        '186.25': '745px',
        '186.5': '746px',
        '186.75': '747px',
        '187': '748px',
        '187.25': '749px',
        '187.5': '750px',
        '187.75': '751px',
        '188': '752px',
        '188.25': '753px',
        '188.5': '754px',
        '188.75': '755px',
        '189': '756px',
        '189.25': '757px',
        '189.5': '758px',
        '189.75': '759px',
        '190': '760px',
        '190.25': '761px',
        '190.5': '762px',
        '190.75': '763px',
        '191': '764px',
        '191.25': '765px',
        '191.5': '766px',
        '191.75': '767px',
        '192': '768px',
        '192.25': '769px',
        '192.5': '770px',
        '192.75': '771px',
        '193': '772px',
        '193.25': '773px',
        '193.5': '774px',
        '193.75': '775px',
        '194': '776px',
        '194.25': '777px',
        '194.5': '778px',
        '194.75': '779px',
        '195': '780px',
        '195.25': '781px',
        '195.5': '782px',
        '195.75': '783px',
        '196': '784px',
        '196.25': '785px',
        '196.5': '786px',
        '196.75': '787px',
        '197': '788px',
        '197.25': '789px',
        '197.5': '790px',
        '197.75': '791px',
        '198': '792px',
        '198.25': '793px',
        '198.5': '794px',
        '198.75': '795px',
        '199': '796px',
        '199.25': '797px',
        '199.5': '798px',
        '199.75': '799px',
        '200': '800px',
        '200.25': '801px',
        '200.5': '802px',
        '200.75': '803px',
        '201': '804px',
        '201.25': '805px',
        '201.5': '806px',
        '201.75': '807px',
        '202': '808px',
        '202.25': '809px',
        '202.5': '810px',
        '202.75': '811px',
        '203': '812px',
        '203.25': '813px',
        '203.5': '814px',
        '203.75': '815px',
        '204': '816px',
        '204.25': '817px',
        '204.5': '818px',
        '204.75': '819px',
        '205': '820px',
        '205.25': '821px',
        '205.5': '822px',
        '205.75': '823px',
        '206': '824px',
        '206.25': '825px',
        '206.5': '826px',
        '206.75': '827px',
        '207': '828px',
        '207.25': '829px',
        '207.5': '830px',
        '207.75': '831px',
        '208': '832px',
        '208.25': '833px',
        '208.5': '834px',
        '208.75': '835px',
        '209': '836px',
        '209.25': '837px',
        '209.5': '838px',
        '209.75': '839px',
        '210': '840px',
        '210.25': '841px',
        '210.5': '842px',
        '210.75': '843px',
        '211': '844px',
        '211.25': '845px',
        '211.5': '846px',
        '211.75': '847px',
        '212': '848px',
        '212.25': '849px',
        '212.5': '850px',
        '212.75': '851px',
        '213': '852px',
        '213.25': '853px',
        '213.5': '854px',
        '213.75': '855px',
        '214': '856px',
        '214.25': '857px',
        '214.5': '858px',
        '214.75': '859px',
        '215': '860px',
        '215.25': '861px',
        '215.5': '862px',
        '215.75': '863px',
        '216': '864px',
        '216.25': '865px',
        '216.5': '866px',
        '216.75': '867px',
        '217': '868px',
        '217.25': '869px',
        '217.5': '870px',
        '217.75': '871px',
        '218': '872px',
        '218.25': '873px',
        '218.5': '874px',
        '218.75': '875px',
        '219': '876px',
        '219.25': '877px',
        '219.5': '878px',
        '219.75': '879px',
        '220': '880px',
        '220.25': '881px',
        '220.5': '882px',
        '220.75': '883px',
        '221': '884px',
        '221.25': '885px',
        '221.5': '886px',
        '221.75': '887px',
        '222': '888px',
        '222.25': '889px',
        '222.5': '890px',
        '222.75': '891px',
        '223': '892px',
        '223.25': '893px',
        '223.5': '894px',
        '223.75': '895px',
        '224': '896px',
        '224.25': '897px',
        '224.5': '898px',
        '224.75': '899px',
        '225': '900px',
        '225.25': '901px',
        '225.5': '902px',
        '225.75': '903px',
        '226': '904px',
        '226.25': '905px',
        '226.5': '906px',
        '226.75': '907px',
        '227': '908px',
        '227.25': '909px',
        '227.5': '910px',
        '227.75': '911px',
        '228': '912px',
        '228.25': '913px',
        '228.5': '914px',
        '228.75': '915px',
        '229': '916px',
        '229.25': '917px',
        '229.5': '918px',
        '229.75': '919px',
        '230': '920px',
        '230.25': '921px',
        '230.5': '922px',
        '230.75': '923px',
        '231': '924px',
        '231.25': '925px',
        '231.5': '926px',
        '231.75': '927px',
        '232': '928px',
        '232.25': '929px',
        '232.5': '930px',
        '232.75': '931px',
        '233': '932px',
        '233.25': '933px',
        '233.5': '934px',
        '233.75': '935px',
        '234': '936px',
        '234.25': '937px',
        '234.5': '938px',
        '234.75': '939px',
        '235': '940px',
        '235.25': '941px',
        '235.5': '942px',
        '235.75': '943px',
        '236': '944px',
        '236.25': '945px',
        '236.5': '946px',
        '236.75': '947px',
        '237': '948px',
        '237.25': '949px',
        '237.5': '950px',
        '237.75': '951px',
        '238': '952px',
        '238.25': '953px',
        '238.5': '954px',
        '238.75': '955px',
        '239': '956px',
        '239.25': '957px',
        '239.5': '958px',
        '239.75': '959px',
        '240': '960px',
        '240.25': '961px',
        '240.5': '962px',
        '240.75': '963px',
        '241': '964px',
        '241.25': '965px',
        '241.5': '966px',
        '241.75': '967px',
        '242': '968px',
        '242.25': '969px',
        '242.5': '970px',
        '242.75': '971px',
        '243': '972px',
        '243.25': '973px',
        '243.5': '974px',
        '243.75': '975px',
        '244': '976px',
        '244.25': '977px',
        '244.5': '978px',
        '244.75': '979px',
        '245': '980px',
        '245.25': '981px',
        '245.5': '982px',
        '245.75': '983px',
        '246': '984px',
        '246.25': '985px',
        '246.5': '986px',
        '246.75': '987px',
        '247': '988px',
        '247.25': '989px',
        '247.5': '990px',
        '247.75': '991px',
        '248': '992px',
        '248.25': '993px',
        '248.5': '994px',
        '248.75': '995px',
        '249': '996px',
        '249.25': '997px',
        '249.5': '998px',
        '249.75': '999px',
        '250': '1000px',
      },
      colors: {
        primary: {
          'P-40': '#5D3361',
          'P-80': '#794C7C',
          'P-90': '#946496',
          'P-95': '#ECB5EC',
        },
        secondary: {
          'S-40': '#534000',
          'S-80': '#715908',
          'S-90': '#8C7223',
        },
        tertiary: {
          'T-40': '#692F49',
          'T-80': '#874863',
          'T-90': '#A3607C',
        },
        neutral: {
          'N-10': '#1F1A1F',
          'N-20': '#352F34',
          'N-30': '#494048',
          'N-50': '#665C64',
          'N-80': '#827880',
          'N-87': '#E2D7DE',
          'N-90': '#EBDFE6',
          'N-92': '#E5E2E1',
          'N-94': '#F6EBF2',
          'N-96': '#FCF0F7',
          'N-98': '#FFF7FA',
        },
        error: {
          'E-40': '#8C0009',
          'E-90': '#DA342E',
        },
        // primary: {
        //   '10': '#36003F',
        //   '20': '#51135B',
        //   '30': '#6B2D73',
        //   '40': '#86458D',
        //   '50': '#A25EA8',
        //   '60': '#BE77C3',
        //   '70': '#DB91E0',
        //   '80': '#F9ACFD',
        //   '90': '#FFD6FD',
        //   '95': '#FFEBFB',
        // },
        // secondary: {
        //   '10': '#241A00',
        //   '20': '#3D2F00',
        //   '30': '#584400',
        //   '40': '#755B00',
        //   '50': '#927300',
        //   '60': '#B18C00',
        //   '70': '#D1A604',
        //   '80': '#EFC12E',
        //   '90': '#FFE08E',
        //   '95': '#FFEFCE',
        // },
        // tertiary: {
        //   '10': '#3E0022',
        //   '20': '#63003B',
        //   '30': '#861653',
        //   '40': '#A5316C',
        //   '50': '#C44B85',
        //   '60': '#E4649F',
        //   '70': '#FF82B9',
        //   '80': '#FFB0CE',
        //   '90': '#FFD9E5',
        //   '95': '#FFECF1',
        // },
        // neutral: {
        //   '10': '#1C1B1B',
        //   '20': '#313030',
        //   '30': '#484646',
        //   '40': '#5F5E5E',
        //   '50': '#787776',
        //   '60': '#929090',
        //   '70': '#ADAAAA',
        //   '80': '#C9C6C5',
        //   '90': '#E5E2E1',
        //   '95': '#F4F0EF',
        // },
      },
      fontFamily: {
        rangga: ['Rangga', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({nocompatible: true})],
} satisfies Config;

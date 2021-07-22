/**
 * 这里放置json 数据撑起组件内容
 */
export const JSONFromService = {
  'id': 1,
  'parentId': 0,
  'label': '进入商城',
  'children': [
    {
      'id': 50,
      'parentId': 1,
      'label': '蚵仔煎',
      'state': null,
      'desc': '',
      'children': [
        {
          'id': 78,
          'parentId': 50,
          'label': '蚵仔煎',
          'state': null,
          'desc': '',
          'children': [
            {
              'id': 123,
              'parentId': 78,
              'label': '龙须面',
              'state': null,
              'desc': '',
              'children': [
                {
                  'id': 162,
                  'parentId': 123,
                  'label': '龙须面',
                  'state': null,
                  'desc': ''
                },
                {
                  'id': 218,
                  'parentId': 123,
                  'label': '双皮奶',
                  'state': null,
                  'desc': ''
                }
              ]
            },
            {
              'id': 140,
              'parentId': 78,
              'label': '北京烤鸭',
              'state': null,
              'desc': ''
            }
          ]
        },
        {
          'id': 135,
          'parentId': 50,
          'label': '龙须面',
          'state': null,
          'desc': '',
          'children': [
            {
              'id': 203,
              'parentId': 135,
              'label': '龙须面',
              'state': null,
              'desc': '',
              'children': [
                {
                  'id': 240,
                  'parentId': 203,
                  'label': '蚵仔煎',
                  'state': null,
                  'desc': ''
                },
                {
                  'id': 234,
                  'parentId': 203,
                  'label': '北京烤鸭',
                  'state': null,
                  'desc': ''
                }
              ]
            },
            {
              'id': 186,
              'parentId': 135,
              'label': '龙须面',
              'state': null,
              'desc': ''
            }
          ]
        }
      ]
    },
    {
      'id': 66,
      'parentId': 1,
      'label': '龙须面',
      'state': null,
      'desc': '',
      'children': [
        {
          'id': 110,
          'parentId': 66,
          'label': '蚵仔煎',
          'state': null,
          'desc': '',
          'children': [
            {
              'id': 147,
              'parentId': 110,
              'label': '双皮奶',
              'state': null,
              'desc': ''
            },
            {
              'id': 164,
              'parentId': 110,
              'label': '北京烤鸭',
              'state': null,
              'desc': ''
            }
          ]
        },
        {
          'id': 100,
          'parentId': 66,
          'label': '北京烤鸭',
          'state': null,
          'desc': ''
        }
      ]
    }
  ]
}
// export const JSONFromService = {
//   id: 1,
//   parentId: 0,
//   label: '进入商城',
// children: {
//   id: 1,
//   parentId: 0,
//   label: '挑选物品',
//   children: {
//     id: 1,
//     parentId: 0,
//     label: '查看参数',
//     children: [
//       {
//         id: 1,
//         parentId: 0,
//         label: '觉得满意',
//         children: [
//           {
//             id: 1,
//             parentId: 0,
//             label: '立即购买',
//             children: [
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '觉得好用',
//                 children: {
//                   id: 1,
//                   parentId: 0,
//                   label: '下次再来'
//                 }
//               },
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '觉得一般'
//               },
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '觉得不好用'
//               }
//             ]
//           },
//           {
//             id: 1,
//             parentId: 0,
//             label: '以后再买',
//             children: {
//               id: 1,
//               parentId: 0,
//               label: '又来光顾了',
//               children: [
//                 {
//                   id: 1,
//                   parentId: 0,
//                   label: '买了'
//                 }
//               ]
//             }
//           }
//         ]
//       },
//       {
//         id: 1,
//         parentId: 0,
//         label: '觉得一般',
//         children: [
//           {
//             id: 1,
//             parentId: 0,
//             label: '思前想后',
//             children: [
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '回家睡觉'
//               },
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '勉强接受',
//                 children: [
//                   {
//                     id: 1,
//                     parentId: 0,
//                     label: '还是买了'
//                   },
//                   {
//                     id: 1,
//                     parentId: 0,
//                     label: '走人'
//                   }
//                 ]
//               },
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '犹豫',
//                 children: [
//                   {
//                     id: 1,
//                     parentId: 0,
//                     label: '还是买了'
//                   },
//                   {
//                     id: 1,
//                     parentId: 0,
//                     label: '走人'
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       },
//       {
//         id: 1,
//         parentId: 0,
//         label: '觉得垃圾',
//         children: [
//           {
//             id: 1,
//             parentId: 0,
//             label: '当场走人',
//             children: {
//               id: 1,
//               parentId: 0,
//               label: '回家睡觉'
//             }
//           },
//           {
//             id: 1,
//             parentId: 0,
//             label: '勉强接受',
//             children: [
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '还是买了'
//               },
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '走人'
//               }
//             ]
//           },
//           {
//             id: 1,
//             parentId: 0,
//             label: '犹豫',
//             children: [
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '还是买了'
//               },
//               {
//                 id: 1,
//                 parentId: 0,
//                 label: '走人'
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// }
// }


export * from './matcher'
export * from './view'

// interface Clazz {
//   pushConjunction: (conj: Conjunction) => void
// }

// function proxify<T>(clazz: Clazz) {
//   return new Proxy(clazz, {
//     get(t, p, r) {
//       if (p in t) {
//         if (p === 'and') {
//           t.pushConjunction('and')
//         }
//       }
//     },
//   })
// }

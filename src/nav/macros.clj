(ns nav.macros)

(defmacro spy [x]
  `(let [x# ~x]
     (println '~x " => " x#)
     x#))

(defmacro with-tag-parsers [bindings & body]
  `(do
     ~@(for [[k v] (partition 2 bindings)]
        `(cljs.reader/register-tag-parser! '~k ~v))
     (let [value# (do ~@body)]
       ~@(for [[k] (partition 2 bindings)]
          `(cljs.reader/deregister-tag-parser! '~k))
       value#)))

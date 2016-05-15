(ns nav.core
  (:require-macros [nav.macros :refer [spy]])
  (:require [clojure.string :as string]
            [vdom.core :refer [renderer]]
            [nav.geo :as geo]
            [nav.ui :as ui]
            [nav.bodies :as bodies]))

(enable-console-print!)

(defonce model
  (atom
    {:zoom 20
     :locations []
     :date (geo/zero-time (js/Date.))
     }))

(defmulti emit (fn [t & _] t))

(defmethod emit 'set/zoom [_ level]
  (swap! model assoc :zoom level))

(defmethod emit 'set/date [_ date]
  (let [[y m d] (map int (string/split date "-"))]
    (swap! model assoc :date
      (js/Date. y (dec m) d))))

(defmethod emit 'locations/add [_ body]
  (swap! model update :locations #(vector (last %) body)))

(defonce render!
  (let [r (renderer (.getElementById js/document "app"))]
    #(r (ui/ui emit @model))))

(defonce on-update
  (add-watch model :rerender
    (fn [_ _ _ model]
      (render! model))))

(render! @model)

(comment
  (swap! model assoc :date (geo/zero-time (js/Date. 2254 9 30)))
  )

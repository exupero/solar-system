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
    {:zoom -77
     :pan [0 0]
     :locations []
     :date (geo/zero-time (js/Date.))
     }))

(defmulti emit (fn [t & _] t))

(defmethod emit 'zoom/change [_ f]
  (swap! model update :zoom f))

(defmethod emit 'set/date [_ date]
  (let [[y m d] (map int (string/split date "-"))]
    (swap! model assoc :date
      (js/Date. y (dec m) d))))

(defmethod emit 'locations/add [_ body]
  (swap! model update :locations #(vector (last %) body)))

(defmethod emit 'pan/hold [_ x y]
  (swap! model assoc :hold [x y]))

(defmethod emit 'pan/drag [_ x y]
  (when-let [hold (@model :hold)]
    (let [v (mapv - [x y] hold)]
      (swap! model
        (fn [m]
          (-> m
            (assoc :hold [x y])
            (update :pan #(mapv + % v))))))))

(defmethod emit 'pan/release [_]
  (swap! model dissoc :hold))

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

(ns nav.core
  (:require-macros [nav.macros :refer [spy]])
  (:require [vdom.core :refer [renderer]]
            [nav.ui :as ui]
            [nav.bodies :refer [bodies]]))

(enable-console-print!)

(defonce model
  (atom
    {:zoom 20}))

(defmulti emit (fn [t & _] t))

(defmethod emit 'set/zoom [_ level]
  (swap! model assoc :zoom level))

(defonce render!
  (let [r (renderer (.getElementById js/document "app"))]
    #(r (ui/ui emit @model))))

(defonce on-update
  (add-watch model :rerender
    (fn [_ _ _ model]
      (render! model))))

(render! @model)

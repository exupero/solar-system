(ns nav.core
  (:require-macros [nav.macros :refer [spy with-tag-parsers]])
  (:require [clojure.string :as string]
            [cljs.reader :as edn]
            [vdom.core :refer [renderer]]
            [nav.geo :as geo]
            [nav.ui :as ui])
  (:import [goog.net XhrIo]))

(enable-console-print!)

(defonce model
  (atom
    {:zoom -77
     :pan [0 0]
     :locations []
     :date (geo/zero-time (js/Date.))
     :bodies []}))

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

(defn epoch [v]
  (cond
    (= v 'J2000) geo/J2000
    (and (vector? v) (#{3 4} (count v))) (apply geo/epoch v)
    :else (throw (js/Error. (str "Bad epoch: " v)))))

(defn read-bodies [raw]
  (with-tag-parsers
    [kg identity
     m identity
     deg geo/deg->rad
     days geo/days->seconds
     epoch epoch
     au geo/au->meters
     years #(-> % geo/years->days geo/days->seconds)]
    (edn/read-string raw)))

(defonce fetch-bodies
  (.send XhrIo "bodies.edn"
    (fn [e]
      (this-as this
        (swap! model assoc :bodies (read-bodies (.getResponseText this)))))
    "GET" nil
    #js {"Content-Type" "application/edn"}))

(render! @model)

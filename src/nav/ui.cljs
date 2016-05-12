(ns nav.ui
  (:require-macros [nav.macros :refer [spy]])
  (:require [clojure.string :as string]
            [nav.geo :as geo]
            [nav.bodies :as bodies]))

(def translate #(str "translate(" %1 "," %2 ")"))

(defn pair [[x y]]
  (str x "," y))

(defn path [pts]
  (->> pts
    (map pair)
    (interpose "L")
    (string/join "")
    (str "M")))

(defn chart [emit {:keys [zoom]}]
  (let [[w h] [500 500]
        scale (geo/linear [1 100] [5e-11 5e-9])
        project (fn [[x y]]
                  (let [[x y] (map #(* % (scale zoom)) [x y])]
                    [x (- y)]))
        today (geo/today)]
    [:svg
     {:width w
      :height h
      :font-family "PT Sans"
      :font-size "8pt"
      :style {:border "1px solid lightgray"}}
     [:g {:transform (translate (/ w 2) (/ h 2))}
      [:circle {:cx 0 :cy 0 :r 2}]
      [:text {:dy -3 :text-anchor "middle"} "Sun"]
      (for [b bodies/bodies
            :let [[x y] (project (bodies/position b today))]]
        [:g {}
         [:path {:d (path (for [d (geo/orbit-dates today (bodies/period b))]
                            (project (bodies/position b d))))
                 :stroke "lightgray"
                 :fill "none"}]
         [:g {:transform (translate x y)}
          [:circle {:r 2}]
          [:text {:dy -3 :text-anchor "middle"} (bodies/identifier b)]]])]]))

(defn ui [emit model]
  [:main {}
   [:input
    {:type "range"
     :min "1"
     :max "100"
     :value (model :zoom)
     :oninput #(this-as this (emit 'set/zoom (.-value this)))}]
   (model :zoom)
   (chart emit model)])

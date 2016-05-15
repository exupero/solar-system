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

(defn left-pad [width pad s]
  (let [padding (repeat (- width (count (str s))) pad)]
    (str (apply str padding) s)))

(defn fmt-date [d]
  (str
    (.getFullYear d)
    "-" (left-pad 2 "0" (inc (.getMonth d)))
    "-" (left-pad 2 "0" (.getDate d))))

(defn controls [emit {:keys [zoom locations date]}]
  [:div {}
   [:div {}
    [:input
     {:type "range"
      :min "1"
      :max "100"
      :value zoom
      :oninput #(this-as this (emit 'set/zoom (.-value this)))}]
    zoom]
   [:div {}
    "Date: "
    [:input
     {:placeholder "YYYY-MM-DD"
      :value (fmt-date date)
      :onchange #(this-as this (emit 'set/date (.-value this)))}]]
   (let [[from to] locations]
     (when (and from to)
       [:div {}
        [:strong {} "Distance: "]
        (let [dist (geo/dist
                     (bodies/position from date)
                     (bodies/position to date))]
          [:span {} (geo/round (geo/meters->au dist) 0.01) " AU"])]))])

(defn body [emit project date b]
  [:g {:transform (->> date (bodies/position b) project (apply translate))
       :style {:cursor "pointer"}
       :onclick #(emit 'locations/add b)}
   [:circle {:r 2 :fill "white"}]
   [:text
    {:dy -3
     :text-anchor "middle"
     :stroke "black"
     :stroke-width 2}
    (bodies/identifier b)]
   [:text
    {:dy -3
     :text-anchor "middle"
     :fill "white"}
    (bodies/identifier b)]])

(defn system [emit project date]
  [:g {}
   (for [b bodies/planets]
     [:path
      {:d (path (for [d (geo/orbit-dates date (bodies/period b))]
                  (project (bodies/position b d))))
       :stroke "dimgray"
       :fill "none"}])
   (for [b (concat bodies/stars bodies/planets #_bodies/asteroids)]
     (body emit project date b))])

(defn chart [emit {:keys [zoom locations date]}]
  (let [[w h] [500 500]
        scale (geo/linear [1 100] [5e-11 5e-9])
        project (fn [[x y]]
                  (let [[x y] (map #(* % (scale zoom)) [x y])]
                    [x (- y)]))]
    [:svg
     {:width w
      :height h
      :font-family "PT Sans"
      :font-size "8pt"
      :style {:border "1px solid lightgray"}}
     [:rect {:width w :height h :fill "black"}]
     [:g {:transform (translate (/ w 2) (/ h 2))}
      (system emit project date)
      (let [[from to] locations]
        (when (and from to)
          (let [from (project (bodies/position from date))
                to (project (bodies/position to date))
                mid (geo/v-div (geo/v-add from to) 2)]
            [:g {}
             [:path
              {:d (path [from to])
               :stroke "dodgerblue"
               :fill "none"}]])))]]))

(defn info [emit {:keys [from to date]}]
  (let [dist (geo/dist
               (bodies/position from date)
               (bodies/position to date))]
    [:div {}
     [:div {}
      [:strong {} "Travel time at 9.8 m/s²: "]
      (let [[d h m] (geo/seconds->days-hours-minutes
                      (geo/travel-time dist 9.8))]
        [:span {} d " days " h " hours " m " minutes"])]
     [:div {}
      [:strong {} "Fuel as percentage of ship's mass, thrust at 0.05c: "]
      (let [r (geo/fuel-to-ship-mass-ratio dist (* 0.05 geo/c) 9.8)]
        [:span {} (geo/round (* 100 r) 0.01) "%"])]
     ]))

(defn ui [emit model]
  [:main {}
   (controls emit model)
   (chart emit model)])

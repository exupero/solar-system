(ns nav.ui
  (:require-macros [nav.macros :refer [spy]])
  (:require [clojure.string :as string]
            [nav.geo :as geo]
            [nav.bodies :as bodies]))

(def minor-body #{:dwarf-planet :asteroid})

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

(defn fmt-thousands [x]
  (string/replace (.toString x) #"\B(?=(\d{3})+(?!\d))" ","))

(defn controls [emit {:keys [zoom locations date]}]
  [:div {}
   [:div {:className "right"}
    (let [[from to] locations]
      (if (and from to)
        (let [dist (geo/dist
                     (bodies/position (bodies/body from) date)
                     (bodies/position (bodies/body to) date))]
          [:div {}
           [:div {}
            (geo/round (geo/meters->au dist) 0.01) " AU"
            " (" (fmt-thousands (geo/round (/ dist 1000))) " km)"]
           (when (re-find #"travel" (-> js/window .-location .-search))
             [:div {}
              [:div {}
               (let [[d h m] (geo/seconds->days-hours-minutes
                               (geo/travel-time dist 9.8))]
                 [:span {} d " days " h " hours " m " minutes"])]
              [:div {}
               (geo/round (* 100 (geo/fuel-to-ship-mass-ratio dist (* 0.05 geo/c) 9.8)) 0.1) "%"]
              ])])
        "Click two bodies to see the distance between them."))]
   [:div {:className "spaced"}
    "Zoom:"
    [:button
     {:className "button--square"
      :onclick #(emit 'zoom/change dec)}
     "-"]
    [:span {} zoom]
    [:button
     {:className "button--square"
      :onclick #(emit 'zoom/change inc)}
     "+"]]
   [:div {:className "spaced"}
    "Date:"
    [:input
     {:placeholder "YYYY-MM-DD"
      :value (fmt-date date)
      :onchange #(this-as this (emit 'set/date (.-value this)))}]]
   ])

(defn body [emit project date b]
  (let [size (if (minor-body (b :body/type))
               "8" "10")
        color (if (minor-body (b :body/type))
                "hsl(0, 0%, 70%)"
                "hsl(0, 0%, 100%)")]
    [:g {:transform (->> date (bodies/position b) project (apply translate))
         :style {:cursor "pointer"}
         :onclick #(emit 'locations/add (b :body/name))}
     [:circle {:r 2 :fill color}]
     [:text
      {:dy -3
       :font-size size
       :text-anchor "middle"
       :stroke "black"
       :stroke-width 2}
      (b :body/name)]
     [:text
      {:dy -3
       :font-size size
       :text-anchor "middle"
       :fill color}
      (b :body/name)]]))

(defn chart [emit {:keys [zoom pan locations date]}]
  (let [[w h] [960 600]
        scale (fn [z]
                (let [a (/ (geo/ln 2e-12) -100)]
                  (geo/pow geo/e (* a z))))
        project (fn [[x y]]
                  (let [s (scale zoom)]
                    [(* s x) (* s (- y))]))]
    [:svg
     {:width w
      :height h
      :font-family "PT Sans"
      :font-size "8pt"
      :style {:border "1px solid lightgray"
              :cursor "move"}
      :onmousedown
      (fn [e]
        (.preventDefault e)
        (emit 'pan/hold (.-clientX e) (.-clientY e)))
      :onmousemove
      (fn [e]
        (.preventDefault e)
        (emit 'pan/drag (.-clientX e) (.-clientY e)))
      :onmouseup
      (fn [e]
        (.preventDefault e)
        (emit 'pan/release))}
     [:rect {:width w :height h :fill "black"}]
     [:g {:transform (translate (/ w 2) (/ h 2))}
      [:g {:transform (apply translate pan)}
       (for [b (bodies/all)]
         [:path
          {:d (path (for [d (->> (b :body/name) bodies/period geo/days->seconds (geo/orbit-dates date))]
                      (project (bodies/position b d))))
           :stroke (if (minor-body (b :body/type))
                     "hsl(0, 0%, 20%)"
                     "hsl(0, 0%, 50%)")
           :fill "none"}])
       (for [b (bodies/all)]
         (body emit project date b))
       (let [[from to] locations]
         (when (and from to)
           (let [from (project (bodies/position (bodies/body from) date))
                 to (project (bodies/position (bodies/body to) date))
                 mid (geo/v-div (geo/v-add from to) 2)]
             [:g {}
              [:path
               {:d (path [from to])
                :stroke "dodgerblue"
                :fill "none"}]])))]]]))

(defn ui [emit model]
  [:main {}
   (controls emit model)
   (chart emit model)])

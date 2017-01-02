(ns nav.ui
  (:require-macros [nav.macros :refer [spy]])
  (:require [clojure.string :as string]
            [nav.geo :as geo]
            [nav.orbit :as orbit]))

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

(defn controls [emit {:keys [zoom locations date]}]
  [:div {}
   [:div {:className "right"}
    (let [[from to] locations]
      (if (and from to)
        (let [dist (geo/dist
                     (orbit/position from date)
                     (orbit/position to date))]
          [:div {}
           [:div {}
            (.toFixed (geo/meters->au dist) 3) " AU"
            " (" (.toLocaleString (geo/round (/ dist 1000))) " km)"]])
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

(defn body [emit project date body]
  (let [size (if (minor-body (:type body))
               "8" "10")
        color (if (minor-body (:type body))
                "hsl(0, 0%, 70%)"
                "hsl(0, 0%, 100%)")]
    [:g {:transform (->> date (orbit/position body) project (apply translate))
         :style {:cursor "pointer"}
         :onclick #(emit 'locations/add body)}
     [:circle {:r 2 :fill color}]
     [:text
      {:dy -3
       :font-size size
       :text-anchor "middle"
       :stroke "black"
       :stroke-width 2}
      (:name body)]
     [:text
      {:dy -3
       :font-size size
       :text-anchor "middle"
       :fill color}
      (:name body)]]))

(defn chart [emit {:keys [bodies zoom pan locations date]}]
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
       (for [body bodies]
         [:path
          {:d (path (for [date (->> body :period (geo/orbit-dates date))]
                      (project (orbit/position body date))))
           :stroke (if (minor-body (:type body))
                     "hsl(0, 0%, 20%)"
                     "hsl(0, 0%, 50%)")
           :fill "none"}])
       (for [b bodies]
         (body emit project date b))
       (let [[from to] locations]
         (when (and from to)
           (let [from (project (orbit/position from date))
                 to (project (orbit/position to date))]
             [:g {}
              [:path
               {:d (path [from to])
                :stroke "dodgerblue"
                :fill "none"}]])))]]]))

(defn ui [emit model]
  [:main {}
   (controls emit model)
   (chart emit model)])

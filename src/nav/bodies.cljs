(ns nav.bodies
  (:require [nav.orbit :as o]
            [nav.geo :as geo :refer [deg->rad]]))

(defn epoch [y m d]
  (js/Date. y (dec m) d 12 0 0))

(def J2000 (epoch 2000 1 1))

(def au #(* % 1.496e8))

(defprotocol IBody
  (-identifier [_])
  (-mass [_])
  (-period [_])
  (-position [this date]))

(defn identifier [b]
  (-identifier b))

(defn mass [b]
  (-mass b))

(defn position [b date]
  (-position b date))

(defn pull [b1 b2 date]
  "returns vector in m/s²"
  (let [p1 (position b1 date)
        p2 (position b2 date)]
    (geo/v-mul
      (geo/v-norm (geo/v-add p1 (geo/v-mul p2 -1)))
      (/ (* geo/G (mass b1))
         (geo/sqr
           (geo/dist p1 p2))))))

(defrecord StaticBody [id mass position]
  IBody
  (-identifier [_] id)
  (-mass [_] mass)
  (-position [_ _] position))

(defrecord OrbitalBody [id mass a e i Ω ω P M0 t0]
  IBody
  (-identifier [_] id)
  (-mass [_] mass)
  (-position [this date]
    (o/position
      (* a 1000) ; km -> m
      e
      (deg->rad i)
      (deg->rad Ω)
      (deg->rad ω)
      (.period this)
      (deg->rad M0)
      (/ (.getTime t0) 1000)
      (/ (.getTime date) 1000)))
  Object
  (period [_]
    ; days -> seconds
    (* P 24 60 60)))

(defn period [b]
  (.period b))

(def stars
  ;             name  mass (kg)  position (m)
  [(StaticBody. "Sol" 1.98855e30 [0 0 0])])

(def planets
  ;              name      mass (kg)  a (km)       e         i° (ec)  Ω°        ω°        P (days)      M0°      t0
  [(OrbitalBody. "Mercury" 3.3011e23  57.90905e6   0.205630  7.005    48.331    29.124    87.969        174.796  J2000)
   (OrbitalBody. "Venus"   4.8675e24  108.208e6    0.006772  3.39458  76.860    54.884    224.701       50.115   J2000)
   (OrbitalBody. "Earth"   5.97237e24 149.598023e6 0.0167086 0.00005  -11.26064 114.20783 365.256363004 358.617  J2000)
   (OrbitalBody. "Mars"    6.4171e23  227.9392e6   0.0934    1.850    49.558    286.502   686.971       19.373   J2000)
   (OrbitalBody. "Jupiter" 1.8986e27  778.299e6    0.048498  1.303    100.464   273.867   4332.59       20.020   J2000)
   (OrbitalBody. "Saturn"  5.6836e26  1429.39e6    0.05555   2.485240 113.665   339.392   10759.22      317.020  J2000)
   (OrbitalBody. "Uranus"  8.6810e25  2875.04e6    0.046381  0.773    74.006    96.998857 30688.5       142.2386 J2000)
   (OrbitalBody. "Neptune" 1.0243e26  4504.45e6    0.009456  1.767975 131.784   276.336   60182         256.228  J2000)
   ])

(def asteroids
  ;              name      mass (kg)  a (km)       e          i° (ec)   Ω°         ω°         P (days)    M0°        t0
  [(OrbitalBody. "Ceres"   9.393e20   414.01e6     0.075823   10.593    80.3293    72.5220    1681.63     95.9891    (epoch 2014 12 9))
   (OrbitalBody. "Pallas"  2.11e20    414.7e6      0.23127363 34.840998 173.096248 309.930328 1685.371678 78.228704  (epoch 2014 12 9))
   (OrbitalBody. "Vesta"   2.59076e20 (au 2.36179) 0.08874    7.14043   103.85136  151.19853  1325.75     20.86384   (epoch 2014 12 9))
   (OrbitalBody. "Juno"    2.67e19    399.725e6    0.25545    12.9817   169.8712   248.4100   1594.18     33.077     (epoch 2014 12 9))
   (OrbitalBody. "Astrea"  2.9e18     384.945e6    0.19113549 5.368523  141.59556  358.92898  1508.213773 260.189542 (epoch 2014 12 9))
   (OrbitalBody. "Hebe"    1.28e19    362.851e6    0.202      14.751    138.752    239.492    1379.756    247.947    (epoch 2005 11 26))
   (OrbitalBody. "Iris"    1.62e19    356.798e6    0.231      5.527     259.727    145.440    1345.375    269.531    (epoch 2005 11 26))
   (OrbitalBody. "Flora"   8.47e18    329.422e6    0.1561     5.886     111.011    285.128    1193.549    156.401    (epoch 2005 11 26))
   (OrbitalBody. "Metis"   1.47e19    357.556e6    0.122      5.576     68.982     5.489      1346.815    274.183    (epoch 2004 7 14))
   (OrbitalBody. "Hygiea"  8.67e19    (au 3.1421)  0.1146     3.8377    283.41     312.10     2034.3      264.46     (epoch 2015 6 27))
   ])

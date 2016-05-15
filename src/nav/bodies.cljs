(ns nav.bodies
  (:refer-clojure :exclude [type])
  (:require-macros [nav.macros :refer [spy]])
  (:require [datascript.core :as d]
            [nav.orbit :as o]
            [nav.geo :as geo :refer [deg->rad]]))

(defonce bodies (d/create-conn {:body/name {:db/unique :db.unique/identity}}))

(defn epoch [y m d]
  (js/Date. y (dec m) d 12 0 0))

(def J2000 (epoch 2000 1 1))

(def au #(* % 1.496e11))

(defrecord OrbitalBody [id mass a e i Ω ω P M0 t0]
  Object
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
      (/ (.getTime date) 1000))))

(defn all []
  (d/q '[:find [(pull ?i [:body/name :body/type]) ...]
         :where [?i :body/name]]
       @bodies))

(defn position [nm date]
  (let [b (d/q '[:find (pull ?i
                         [:body/position
                          :body/semi-major-axis
                          :body/eccentricity
                          :body/inclination
                          :body/longitude-of-ascending-node
                          :body/longitude-of-perihelion
                          :body/period
                          :body/mean-anomaly-at-epoch
                          :body/epoch]) .
                      :in $ ?name
                      :where [?i :body/name ?name]]
                    @bodies nm)]
    (if-let [p (b :body/position)]
      p
      (o/position
        (b :body/semi-major-axis)
        (b :body/eccentricity)
        (deg->rad (b :body/inclination))
        (deg->rad (b :body/longitude-of-ascending-node))
        (deg->rad (b :body/longitude-of-perihelion))
        (geo/days->seconds (b :body/period))
        (deg->rad (b :body/mean-anomaly-at-epoch))
        (/ (.getTime (b :body/epoch)) 1000)
        (/ (.getTime date) 1000)))))

(defn period [nm]
  (d/q '[:find ?p .
         :in $ ?name
         :where
         [?i :body/name ?name]
         [?i :body/period ?p]]
       @bodies nm))

(defn type [nm]
  (d/q '[:find ?t .
         :in $ ?name
         :where
         [?i :body/name ?name]
         [?i :body/type ?t]]
       @bodies nm))

(defonce initialize
  (d/transact!
    bodies
    [{:body/name "Sol"
      :body/type :star
      :body/mass 1.98855e30                    ; kg
      :body/position [0 0 0]}
     {:body/name "Mercury"
      :body/type :planet
      :body/mass 3.3011e23                     ; kg
      :body/semi-major-axis 57.90905e9         ; m
      :body/eccentricity 0.205630              ; degrees
      :body/inclination 7.005                  ; degrees from ecliptic
      :body/longitude-of-ascending-node 48.331 ; degrees
      :body/longitude-of-perihelion 29.124     ; degrees
      :body/period 87.969                      ; days
      :body/mean-anomaly-at-epoch 174.796      ; degrees
      :body/epoch J2000}                       ; JavaScript date
     {:body/name "Venus"
      :body/type :planet
      :body/mass 4.8675e24
      :body/semi-major-axis 108.208e9
      :body/eccentricity 0.006772
      :body/inclination 3.39458
      :body/longitude-of-ascending-node 76.860
      :body/longitude-of-perihelion 54.884
      :body/period 224.701
      :body/mean-anomaly-at-epoch 50.115
      :body/epoch J2000}
     {:body/name "Earth"
      :body/type :planet
      :body/mass 5.97237e24
      :body/semi-major-axis 149.598023e9
      :body/eccentricity 0.0167086
      :body/inclination 0.00005
      :body/longitude-of-ascending-node -11.26064
      :body/longitude-of-perihelion 114.20783
      :body/period 365.256363004
      :body/mean-anomaly-at-epoch 358.617
      :body/epoch J2000}
     {:body/name "Mars"
      :body/type :planet
      :body/mass 6.4171e23
      :body/semi-major-axis 227.9392e9
      :body/eccentricity 0.0934
      :body/inclination 1.850
      :body/longitude-of-ascending-node 49.558
      :body/longitude-of-perihelion 286.502
      :body/period 686.971
      :body/mean-anomaly-at-epoch 19.373
      :body/epoch J2000}
     {:body/name "Jupiter"
      :body/type :planet
      :body/mass 1.8986e27
      :body/semi-major-axis 778.299e9
      :body/eccentricity 0.048498
      :body/inclination 1.303
      :body/longitude-of-ascending-node 100.464
      :body/longitude-of-perihelion 273.867
      :body/period 4332.59
      :body/mean-anomaly-at-epoch 20.020
      :body/epoch J2000}
     {:body/name "Saturn"
      :body/type :planet
      :body/mass 5.6836e26
      :body/semi-major-axis 1429.39e9
      :body/eccentricity 0.05555
      :body/inclination 2.485240
      :body/longitude-of-ascending-node 113.665
      :body/longitude-of-perihelion 339.392
      :body/period 10759.22
      :body/mean-anomaly-at-epoch 317.020
      :body/epoch J2000}
     {:body/name "Uranus"
      :body/type :planet
      :body/mass 8.6810e25
      :body/semi-major-axis 2875.04e9
      :body/eccentricity 0.046381
      :body/inclination 0.773
      :body/longitude-of-ascending-node 74.006
      :body/longitude-of-perihelion 96.998857
      :body/period 30688.5
      :body/mean-anomaly-at-epoch 142.2386
      :body/epoch J2000}
     {:body/name "Neptune"
      :body/type :planet
      :body/mass 1.0243e26
      :body/semi-major-axis 4504.45e9
      :body/eccentricity 0.009456
      :body/inclination 1.767975
      :body/longitude-of-ascending-node 131.784
      :body/longitude-of-perihelion 276.336
      :body/period 60182
      :body/mean-anomaly-at-epoch 256.228
      :body/epoch J2000}
     {:body/name "Ceres"
      :body/type :dwarf-planet
      :body/mass 9.393e20
      :body/semi-major-axis 414.01e9
      :body/eccentricity 0.075823
      :body/inclination 10.593
      :body/longitude-of-ascending-node 80.3293
      :body/longitude-of-perihelion 72.5220
      :body/period 1681.63
      :body/mean-anomaly-at-epoch 95.9891
      :body/epoch (epoch 2014 12 9)}
     {:body/name "Pallas"
      :body/type :asteroid
      :body/mass 2.11e20
      :body/semi-major-axis 414.7e9
      :body/eccentricity 0.23127363
      :body/inclination 34.840998
      :body/longitude-of-ascending-node 173.096248
      :body/longitude-of-perihelion 309.930328
      :body/period 1685.371678
      :body/mean-anomaly-at-epoch 78.228704
      :body/epoch (epoch 2014 12 9)}
     {:body/name "Vesta"
      :body/type :asteroid
      :body/mass 2.59076e20
      :body/semi-major-axis (au 2.36179)
      :body/eccentricity 0.08874
      :body/inclination 7.14043
      :body/longitude-of-ascending-node 103.85136
      :body/longitude-of-perihelion 151.19853
      :body/period 1325.75
      :body/mean-anomaly-at-epoch 20.86384
      :body/epoch (epoch 2014 12 9)}
     {:body/name "Juno"
      :body/type :asteroid
      :body/mass 2.67e19
      :body/semi-major-axis 399.725e9
      :body/eccentricity 0.25545
      :body/inclination 12.9817
      :body/longitude-of-ascending-node 169.8712
      :body/longitude-of-perihelion 248.4100
      :body/period 1594.18
      :body/mean-anomaly-at-epoch 33.077
      :body/epoch (epoch 2014 12 9)}
     {:body/name "Astrea"
      :body/type :asteroid
      :body/mass 2.9e18
      :body/semi-major-axis 384.945e9
      :body/eccentricity 0.19113549
      :body/inclination 5.368523
      :body/longitude-of-ascending-node 141.59556
      :body/longitude-of-perihelion 358.92898
      :body/period 1508.213773
      :body/mean-anomaly-at-epoch 260.189542
      :body/epoch (epoch 2014 12 9)}
     {:body/name "Hebe"
      :body/type :asteroid
      :body/mass 1.28e19
      :body/semi-major-axis 362.851e9
      :body/eccentricity 0.202
      :body/inclination 14.751
      :body/longitude-of-ascending-node 138.752
      :body/longitude-of-perihelion 239.492
      :body/period 1379.756
      :body/mean-anomaly-at-epoch 247.947
      :body/epoch (epoch 2005 11 26)}
     {:body/name "Iris"
      :body/type :asteroid
      :body/mass 1.62e19
      :body/semi-major-axis 356.798e9
      :body/eccentricity 0.231
      :body/inclination 5.527
      :body/longitude-of-ascending-node 259.727
      :body/longitude-of-perihelion 145.440
      :body/period 1345.375
      :body/mean-anomaly-at-epoch 269.531
      :body/epoch (epoch 2005 11 26)}
     {:body/name "Flora"
      :body/type :asteroid
      :body/mass 8.47e18
      :body/semi-major-axis 329.422e9
      :body/eccentricity 0.1561
      :body/inclination 5.886
      :body/longitude-of-ascending-node 111.011
      :body/longitude-of-perihelion 285.128
      :body/period 1193.549
      :body/mean-anomaly-at-epoch 156.401
      :body/epoch (epoch 2005 11 26)}
     {:body/name "Metis"
      :body/type :asteroid
      :body/mass 1.47e19
      :body/semi-major-axis 357.556e9
      :body/eccentricity 0.122
      :body/inclination 5.576
      :body/longitude-of-ascending-node 68.982
      :body/longitude-of-perihelion 5.489
      :body/period 1346.815
      :body/mean-anomaly-at-epoch 274.183
      :body/epoch (epoch 2004 7 14)}
     {:body/name "Hygiea"
      :body/type :asteroid
      :body/mass 8.67e19
      :body/semi-major-axis (au 3.1421)
      :body/eccentricity 0.1146
      :body/inclination 3.8377
      :body/longitude-of-ascending-node 283.41
      :body/longitude-of-perihelion 312.10
      :body/period 2034.3
      :body/mean-anomaly-at-epoch 264.46
      :body/epoch (epoch 2015 6 27)}]))

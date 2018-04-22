<?php

namespace app\controllers;

use app\assets\AppAsset;
use Yii;
use app\models\Graphs;
use app\models\GraphsSearch;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;

/**
 * GraphsController implements the CRUD actions for Graphs model.
 */
class GraphsController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::class,
                'actions' => [
                    'delete' => ['POST'],
                ],
            ],
        ];
    }

    public function beforeAction($action)
    {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    /**
     * Lists all Graphs models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new GraphsSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Graphs model.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new Graphs model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Graphs();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        }

        return $this->render('create', [
            'model' => $model,
        ]);
    }

    /**
     * Updates an existing Graphs model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        }

        return $this->render('update', [
            'model' => $model,
        ]);
    }

    /**
     * Deletes an existing Graphs model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    public function actionGraph($id)
    {
        if (!$id) {
            return $this->redirect(['index']);
        }

        $model = $this->findModel($id);
        return $this->render('graph', [
            'model' => $model,
        ]);
    }

    public function actionData()
    {
        $type = Yii::$app->request->post('type', 'get');
        $id = Yii::$app->request->post('id', 0);
        switch($type) {
            case 'get':
                $graph = Graphs::findOne("$id");
                return json_encode(['nodes' => json_decode($graph->nodes), 'edges' => json_decode($graph->edges)]);
                break;
            case 'save':
                $graph = Graphs::findOne("$id");
                $nodes = json_encode(Yii::$app->request->post('nodes', []));
                $edges = json_encode(Yii::$app->request->post('edges', []));
                $graph->nodes = $nodes;
                $graph->edges = $edges;
                if ($graph->save()) {
                    return 'OK';
                } else {
                    return 'ERROR';
                }
                break;
        }
    }

    public function actionOnline($id)
    {
        if (!$id) {
            return $this->redirect(['index']);
        }

        $model = $this->findModel($id);
        return $this->render('online', [
            'model' => $model,
        ]);
    }

    /**
     * Finds the Graphs model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Graphs the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Graphs::findOne($id)) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }
}

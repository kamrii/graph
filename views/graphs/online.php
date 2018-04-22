<?php

use yii\helpers\Html;

$this->title = 'Редактирование графа онлайн';
$this->params['breadcrumbs'][] = ['label' => $model->name, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = 'Редактирование графа онлайн';

$this->registerJs('const graphId = window.graphId = ' . $model->id, yii\web\View::POS_END);
$this->registerJsFile('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.js', ['position' => yii\web\View::POS_HEAD]);

$this->registerJsFile('/js/graphs/sigma.min.js', ['position' => yii\web\View::POS_END, 'depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile('/js/graphs/plugins/sigma.parsers.json.min.js', ['position' => yii\web\View::POS_END, 'depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile('/js/graphs/plugins/sigma.plugins.dragNodes.min.js', ['position' => yii\web\View::POS_END, 'depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile('/js/graphs/plugins/sigma.renderers.edgeLabels.min.js', ['position' => yii\web\View::POS_END, 'depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile('/js/graphs/plugins/sigma.pathfinding.astar.min.js', ['position' => yii\web\View::POS_END, 'depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile('/js/graphs/main.js', ['position' => yii\web\View::POS_END, 'depends' => [\yii\web\JqueryAsset::class]]);
$this->registerJsFile('/js/graphs/online.js', ['position' => yii\web\View::POS_END, 'depends' => [\yii\web\JqueryAsset::class]]);
?>
<div class="graphs-graph">
    <h1><?= Html::encode($this->title) ?></h1>
    <div class="row" style="height: 60vh;">
        <div class="col-sm-9" id="graph" style="height: 100%;"></div>
        <div class="col-sm-3 menu">
            <h3>Меню</h3>
            <p>Добавить</p>
            <div class="item add-node">Вершину</div>
            <p>Операции с вершинами
                <span class="text-muted">(Нажмите кнопку и выеберите две вершины)</span>
            </p>
            <div class="item join-node">Соеденить вершины</div>
            <div class="item find-path">Найти кратчайший путь</div>

        </div>
    </div>
</div>
